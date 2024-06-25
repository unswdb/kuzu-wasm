#include <string>

#include<include/web_query_result.h>
#include "common/exception/not_implemented.h"
#include "common/types/uuid.h"
#include "common/types/value/nested.h"
#include "common/types/value/node.h"
#include "common/types/value/rel.h"
#include "utf8proc.h"
#include "utf8proc_wrapper.h"

using namespace kuzu::common;
using namespace kuzu::utf8proc;


bool WebQueryResult::hasNext() {
    return queryResult->hasNext();
}
std::string WebQueryResult::toString() {
    return queryResult->toString();
}


void WebQueryResult::close() {
    queryResult.reset();
}

val WebQueryResult::convertValueToJsObject(const Value& value) {
    if (value.isNull()) {
        return val::null();
    }
    auto dataType = value.getDataType();
    switch (dataType->getLogicalTypeID()) {
        case LogicalTypeID::BOOL:
            return val(value.getValue<bool>());
        case LogicalTypeID::INT8:
            return val(value.getValue<int8_t>());
        case LogicalTypeID::INT16:
            return val(value.getValue<int16_t>());
        case LogicalTypeID::INT32:
            return val(value.getValue<int32_t>());
        case LogicalTypeID::INT64:
        case LogicalTypeID::SERIAL:
            return val(value.getValue<int64_t>());
        case LogicalTypeID::UINT8:
            return val(value.getValue<uint8_t>());
        case LogicalTypeID::UINT16:
            return val(value.getValue<uint16_t>());
        case LogicalTypeID::UINT32:
            return val(value.getValue<uint32_t>());
        case LogicalTypeID::UINT64:
            return val(value.getValue<uint64_t>());
        case LogicalTypeID::INT128: {
            kuzu::common::int128_t result = value.getValue<kuzu::common::int128_t>();
            std::string int128_string = kuzu::common::Int128_t::ToString(result);
            return val(int128_string.c_str());
        }
        case LogicalTypeID::FLOAT:
            return val(value.getValue<float>());
        case LogicalTypeID::DOUBLE:
            return val(value.getValue<double>());
        case LogicalTypeID::STRING:
            return val(value.getValue<std::string>());
        // Other cases...
        default:
            throw NotImplementedException("Unsupported type: " + dataType->toString());
    }
}


std::vector<std::string> WebQueryResult::getColumnDataTypes() {
    auto columnDataTypes = queryResult->getColumnDataTypes();
    std::vector<std::string> result(columnDataTypes.size());
    for (auto i = 0u; i < columnDataTypes.size(); ++i) {
        result[i] = columnDataTypes[i].toString();
    }
    return result;
}


std::vector<std::string> WebQueryResult::getColumnNames() {
    std::vector<std::string> columnNames = queryResult->getColumnNames();
    return columnNames;
}

void WebQueryResult::resetIterator() {
    queryResult->resetIterator();
}

bool WebQueryResult::isSuccess() const {
    return queryResult->isSuccess();
}

std::string WebQueryResult::getErrorMessage() const {
    return queryResult->getErrorMessage();
}

double WebQueryResult::getExecutionTime() {
    return queryResult->getQuerySummary()->getExecutionTime();
}

double WebQueryResult::getCompilingTime() {
    return queryResult->getQuerySummary()->getCompilingTime();
}

size_t WebQueryResult::getNumTuples() {
    return queryResult->getNumTuples();
}

double WebQueryResult::getArrowSchema(){
    resultSchema = queryResult->getArrowSchema();
    return reinterpret_cast<uintptr_t>(resultSchema.get());
}

double WebQueryResult::getArrowChunk(){
    int64_t chunkSize = getNumTuples();
    resultArray = queryResult->getNextArrowChunk(chunkSize);
    return reinterpret_cast<uintptr_t>(resultArray.get());
}

std::string WebQueryResult::printExecutionResult() {

    uint64_t maxRowSize;
    uint32_t maxPrintWidth;
    QueryResult& queryResult = *this->queryResult;
    std::string return_text = "";

    auto querySummary = queryResult.getQuerySummary();
    if (querySummary->isExplain()) {
       return_text += queryResult.getNext()->toString();
    } else {
        constexpr uint32_t SMALL_TABLE_SEPERATOR_LENGTH = 3;
        const uint32_t minTruncatedWidth = 20;
        uint64_t numTuples = queryResult.getNumTuples();
        std::vector<uint32_t> colsWidth(queryResult.getNumColumns(), 2);
        for (auto i = 0u; i < colsWidth.size(); i++) {
            colsWidth[i] = queryResult.getColumnNames()[i].length() + 2;
        }
        std::string lineSeparator;
        uint64_t rowCount = 0;
        while (queryResult.hasNext()) {
            if (numTuples > maxRowSize && rowCount >= (maxRowSize / 2) + (maxRowSize % 2 != 0) &&
                rowCount < numTuples - maxRowSize / 2) {
                auto tuple = queryResult.getNext();
                rowCount++;
                continue;
            }
            auto tuple = queryResult.getNext();
            for (auto i = 0u; i < colsWidth.size(); i++) {
                if (tuple->getValue(i)->isNull()) {
                    continue;
                }
                std::string tupleString = tuple->getValue(i)->toString();
                uint32_t fieldLen = 0;
                uint32_t chrIter = 0;
                while (chrIter < tupleString.length()) {
                    fieldLen += Utf8Proc::renderWidth(tupleString.c_str(), chrIter);
                    chrIter =
                        utf8proc_next_grapheme(tupleString.c_str(), tupleString.length(), chrIter);
                }
                // An extra 2 spaces are added for an extra space on either
                // side of the std::string.
                colsWidth[i] = std::max(colsWidth[i], fieldLen + 2);
            }
            rowCount++;
        }

        uint32_t sumGoal = minTruncatedWidth;
        uint32_t maxWidth = minTruncatedWidth;
        if (colsWidth.size() == 1) {
            uint32_t minDisplayWidth = minTruncatedWidth + SMALL_TABLE_SEPERATOR_LENGTH;
            if (maxPrintWidth > minDisplayWidth) {
                sumGoal = maxPrintWidth - 2;
            } else {
                sumGoal = std::max(
                    (uint32_t)(80 - colsWidth.size() - 1),
                    minDisplayWidth);
            }
        } else if (colsWidth.size() > 1) {
            uint32_t minDisplayWidth = SMALL_TABLE_SEPERATOR_LENGTH + minTruncatedWidth * 2;
            if (maxPrintWidth > minDisplayWidth) {
                sumGoal = maxPrintWidth - colsWidth.size() - 1;
            } else {
                // make sure there is space for the first and last column
                sumGoal = std::max(
                    (uint32_t)(80 - colsWidth.size() - 1),
                    minDisplayWidth);
            }
        } else if (maxPrintWidth > minTruncatedWidth) {
            sumGoal = maxPrintWidth;
        }
        uint32_t sum = 0;
        std::vector<uint32_t> maxValueIndex;
        uint32_t secondHighestValue = 0;
        for (auto i = 0u; i < colsWidth.size(); i++) {
            if (maxValueIndex.empty() || colsWidth[i] == colsWidth[maxValueIndex[0]]) {
                maxValueIndex.push_back(i);
                maxWidth = colsWidth[maxValueIndex[0]];
            } else if (colsWidth[i] > colsWidth[maxValueIndex[0]]) {
                secondHighestValue = colsWidth[maxValueIndex[0]];
                maxValueIndex.clear();
                maxValueIndex.push_back(i);
                maxWidth = colsWidth[maxValueIndex[0]];
            } else if (colsWidth[i] > secondHighestValue) {
                secondHighestValue = colsWidth[i];
            }
            sum += colsWidth[i];
        }

        while (sum > sumGoal) {
            uint32_t truncationValue = ((sum - sumGoal) / maxValueIndex.size()) +
                                       ((sum - sumGoal) % maxValueIndex.size() != 0);
            uint32_t newValue = 0;
            if (truncationValue < colsWidth[maxValueIndex[0]]) {
                newValue = colsWidth[maxValueIndex[0]] - truncationValue;
            }
            uint32_t oldValue = colsWidth[maxValueIndex[0]];
            if (secondHighestValue < minTruncatedWidth + 2 && newValue < minTruncatedWidth + 2) {
                newValue = minTruncatedWidth + 2;
            } else {
                uint32_t sumDifference =
                    sum - ((oldValue - secondHighestValue) * maxValueIndex.size());
                if (sumDifference > sumGoal) {
                    newValue = secondHighestValue;
                }
            }
            for (auto i = 0u; i < maxValueIndex.size(); i++) {
                colsWidth[maxValueIndex[i]] = newValue;
            }
            maxWidth = newValue - 2;
            sum -= (oldValue - newValue) * maxValueIndex.size();
            if (newValue == minTruncatedWidth + 2) {
                break;
            }

            maxValueIndex.clear();
            secondHighestValue = 0;
            for (auto i = 0u; i < colsWidth.size(); i++) {
                if (maxValueIndex.empty() || colsWidth[i] == colsWidth[maxValueIndex[0]]) {
                    maxValueIndex.push_back(i);
                } else if (colsWidth[i] > colsWidth[maxValueIndex[0]]) {
                    secondHighestValue = colsWidth[maxValueIndex[0]];
                    maxValueIndex.clear();
                    maxValueIndex.push_back(i);
                } else if (colsWidth[i] > secondHighestValue) {
                    secondHighestValue = colsWidth[i];
                }
            }
        }
        int k = 0;
        int j = colsWidth.size() - 1;
        bool colTruncated = false;
        uint64_t colsPrinted = 0;
        uint32_t lineSeparatorLen = 1u;
        for (auto i = 0u; i < colsWidth.size(); i++) {
            if (k <= j) {
                if ((lineSeparatorLen + colsWidth[k] < sumGoal + colsWidth.size() - 5) ||
                    (lineSeparatorLen + colsWidth[k] < sumGoal + colsWidth.size() + 1 &&
                        (colTruncated || k == j))) {
                    lineSeparatorLen += colsWidth[k] + 1;
                    k++;
                    colsPrinted++;
                } else if (!colTruncated) {
                    lineSeparatorLen += 6;
                    colTruncated = true;
                }
            }
            if (j >= k) {
                if ((lineSeparatorLen + colsWidth[j] < sumGoal + colsWidth.size() - 5) ||
                    (lineSeparatorLen + colsWidth[j] < sumGoal + colsWidth.size() + 1 &&
                        (colTruncated || j == k))) {
                    lineSeparatorLen += colsWidth[j] + 1;
                    j--;
                    colsPrinted++;
                } else if (!colTruncated) {
                    lineSeparatorLen += 6;
                    colTruncated = true;
                }
            }
        }

        lineSeparator = std::string(lineSeparatorLen, '-');
       return_text += lineSeparator + "\n";

        if (queryResult.getNumColumns() != 0 && !queryResult.getColumnNames()[0].empty()) {
            std::string printString = "";
            for (auto i = 0; i < k; i++) {
                printString += "| ";
                printString += queryResult.getColumnNames()[i];
                printString +=
                    std::string(colsWidth[i] - queryResult.getColumnNames()[i].length() - 1, ' ');
            }
            if (j >= k) {
                printString += "| ... ";
            }
            for (auto i = j + 1; i < (int)colsWidth.size(); i++) {
                printString += "| ";
                printString += queryResult.getColumnNames()[i];
                printString +=
                    std::string(colsWidth[i] - queryResult.getColumnNames()[i].length() - 1, ' ');
            }
           return_text += printString + "|\n";
           return_text += lineSeparator + "\n";
        }

        queryResult.resetIterator();
        rowCount = 0;
        bool rowTruncated = false;
        while (queryResult.hasNext()) {
            if (numTuples > maxRowSize && rowCount >= (maxRowSize / 2) + (maxRowSize % 2 != 0) &&
                rowCount < numTuples - maxRowSize / 2) {
                auto tuple = queryResult.getNext();
                if (!rowTruncated) {
                    rowTruncated = true;
                    uint32_t spacesToPrint = (lineSeparatorLen / 2) - 1;
                    for (auto i = 0u; i < 3; i++) {
                        std::string printString = "|";
                        printString += std::string(spacesToPrint, ' ');
                        printString += ".";
                        if (lineSeparatorLen % 2 == 1) {
                            printString += " ";
                        }
                        printString += std::string(spacesToPrint - 1, ' ');
                       return_text += printString + "|\n";
                    }
                   return_text += lineSeparator + "\n";
                }
                rowCount++;
                continue;
            }
            auto tuple = queryResult.getNext();
            auto result = tuple->toString(colsWidth, "|", maxWidth);
            uint64_t startPos = 0;
            std::vector<std::string> colResults;
            for (auto i = 0u; i < colsWidth.size(); i++) {
                uint32_t chrIter = startPos;
                uint32_t fieldLen = 0;
                while (fieldLen < colsWidth[i]) {
                    fieldLen += Utf8Proc::renderWidth(result.c_str(), chrIter);
                    chrIter = utf8proc_next_grapheme(result.c_str(), result.length(), chrIter);
                }
                colResults.push_back(result.substr(startPos, chrIter - startPos));
                // new start position is after the | seperating results
                startPos = chrIter + 1;
            }
            std::string printString = "|";
            for (auto i = 0; i < k; i++) {
                printString += colResults[i] + "|";
            }
            if (j >= k) {
                printString += " ... |";
            }
            for (auto i = j + 1; i < (int)colResults.size(); i++) {
                printString += colResults[i] + "|";
            }
           return_text += printString + "\n";
           return_text += lineSeparator + "\n";
            rowCount++;
        }

        // print query result (numFlatTuples & tuples)
        if (numTuples == 1) {
           return_text += "(1 tuple)\n";
        } else {
           return_text += "(" + std::to_string(numTuples) + " tuples";
            if (rowTruncated) {
               return_text += ", " + std::to_string(maxRowSize) + " shown";
            }
           return_text += ")\n";
        }
        if (colsWidth.size() == 1) {
           return_text += "(1 column)\n";
        } else {
           return_text += "(" + std::to_string(colsWidth.size()) + " columns";
            if (colTruncated) {
               return_text += ", " + std::to_string(colsPrinted) + " shown";
            }
           return_text += "\n";
        }
       return_text += "Time: " + std::to_string(querySummary->getCompilingTime()) + "ms (compiling), " +
                  std::to_string(querySummary->getExecutionTime()) + "ms (executing)\n";
    }
    return return_text;
}