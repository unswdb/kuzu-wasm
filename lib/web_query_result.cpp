#include <string>

#include<include/web_query_result.h>
#include "common/exception/not_implemented.h"
#include "common/types/uuid.h"
#include "common/types/value/nested.h"
#include "common/types/value/node.h"
#include "common/types/value/rel.h"

using namespace kuzu::common;


bool WebQueryResult::hasNext() {
    return queryResult->hasNext();
}
std::string WebQueryResult::toString() {
    return queryResult->toString();
}
// std::string WebQueryResult::toSingleQueryString() {
//     return queryResult->toSingleQueryString();
// }

// val WebQueryResult::getNext() {
//     auto tuple = queryResult->getNext();
//     val result(val::array());
//     for (auto i = 0u; i < tuple->len(); ++i) {
//         result.set(i, convertValueToJsObject(*tuple->getValue(i)));
//     }
//     return result;
// }


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
