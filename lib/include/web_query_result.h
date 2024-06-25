#pragma once

#include <memory>
#include <vector>

// #include "arrow_array.h"
// #include "common/arrow/arrow.h"
#include "common/types/internal_id_t.h"
#include "main/kuzu.h"
#include <emscripten/val.h>

using namespace kuzu::main;
using namespace emscripten;

class WebQueryResult {
    friend class WebConnection;

public:

    WebQueryResult() = default;
    ~WebQueryResult() = default;

    bool hasNext();

    // val getNext();

    void close();

    static val convertValueToJsObject(const kuzu::common::Value& value);

    // std::string toSingleQueryString();

    std::string toString();

    std::vector<std::string> getColumnDataTypes();

    std::vector<std::string> getColumnNames();

    void resetIterator();

    bool isSuccess() const;

    std::string getErrorMessage() const;

    double getExecutionTime();

    double getCompilingTime();

    size_t getNumTuples();

    std::string printExecutionResult();

    double getArrowSchema();

    double getArrowChunk();

private:
    std::unique_ptr<QueryResult> queryResult;

    std::unique_ptr<ArrowSchema> resultSchema;

    std::unique_ptr<ArrowArray> resultArray;
};
