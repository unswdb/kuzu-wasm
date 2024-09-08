#include "main/kuzu.h"
#include <emscripten/bind.h>
using namespace emscripten;
using namespace kuzu::main;

#include "include/web_database.h"
#include "include/web_connection.h"
#include "include/web_prepared_statement.h"
#include "include/web_query_result.h"

int main(){return 0;}


EMSCRIPTEN_BINDINGS(WebDatabase) {
    class_<WebDatabase>("WebDatabase")
        .constructor<const std::string&, uint64_t, uint64_t, bool, bool, uint64_t>()
        .class_function("getVersion", &WebDatabase::getVersion)
        .class_function("getStorageVersion", &WebDatabase::getStorageVersion)
        .function("close", &WebDatabase::close);
}

EMSCRIPTEN_BINDINGS(WebConnection) {
    class_<WebConnection>("WebConnection")
        .constructor<WebDatabase*, uint64_t>()
        .function("setQueryTimeout", &WebConnection::setQueryTimeout)
        .function("setMaxNumThreadForExec", &WebConnection::setMaxNumThreadForExec)
        .function("getNumNodes", &WebConnection::getNumNodes)
        .function("getNumRels", &WebConnection::getNumRels)
        .function("query", &WebConnection::query)
        .function("close", &WebConnection::close);
        // .function("prepare", &WebConnection::prepare)
        // .function("execute", &WebConnection::execute,allow_raw_pointers());
}

EMSCRIPTEN_BINDINGS(WebPreparedStatement) {
    class_<WebPreparedStatement>("WebPreparedStatement")
        .function("getErrorMessage", &WebPreparedStatement::getErrorMessage)
        .function("isSuccess", &WebPreparedStatement::isSuccess);
}

EMSCRIPTEN_BINDINGS(WebQueryResult) {
    register_vector<std::string>("VectorString");
    class_<WebQueryResult>("WebQueryResult")
        .function("hasNext", &WebQueryResult::hasNext)
        .function("close", &WebQueryResult::close)
        .function("getColumnDataTypes", &WebQueryResult::getColumnDataTypes)
        .function("getColumnNames", &WebQueryResult::getColumnNames)
        .function("resetIterator", &WebQueryResult::resetIterator)
        .function("isSuccess", &WebQueryResult::isSuccess)
        .function("getErrorMessage", &WebQueryResult::getErrorMessage)
        .function("getExecutionTime", &WebQueryResult::getExecutionTime)
        .function("getCompilingTime", &WebQueryResult::getCompilingTime)
        .function("toString", &WebQueryResult::toString)
        .function("printExecutionResult", &WebQueryResult::printExecutionResult)
        .function("getArrowChunk", &WebQueryResult::getArrowChunk)
        .function("getArrowSchema", &WebQueryResult::getArrowSchema)
        .function("hasNextQueryResult", &WebQueryResult::hasNextQueryResult)
        .function("getNextQueryResult", &WebQueryResult::getNextQueryResult)
        .function("getNumTuples", &WebQueryResult::getNumTuples);
        // .class_function("convertValueToJsObject", &WebQueryResult::convertValueToJsObject)
        // .function("getNext", &WebQueryResult::getNext)

}


// register_vector<std::string>("VectorString");
