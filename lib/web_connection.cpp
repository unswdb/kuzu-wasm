#include "include/web_connection.h"

#include <utility>

#include "main/connection.h"

using namespace kuzu::common;
using namespace kuzu;

// Tod do: create_function(UDF)

WebConnection::WebConnection(WebDatabase* WebDatabase, uint64_t numThreads) {
    storageDriver = std::make_unique<kuzu::main::StorageDriver>(WebDatabase->database.get());
    conn = std::make_unique<Connection>(WebDatabase->database.get());
    if (numThreads > 0) {
        conn->setMaxNumThreadForExec(numThreads);
    }
}

void WebConnection::close() {
    conn.reset();
}

void WebConnection::setQueryTimeout(uint64_t timeoutInMS) {
    conn->setQueryTimeOut(timeoutInMS);
}

std::unique_ptr<WebQueryResult> WebConnection::query(std::string queryStatement) {
    auto queryResult = conn->query(queryStatement);
    auto webQueryResult = std::make_unique<WebQueryResult>();
    webQueryResult->queryResult = std::move(queryResult);
    return webQueryResult;
}

std::unique_ptr<WebQueryResult> WebConnection::execute(
    WebPreparedStatement* preparedStatement) {
    // add parameters functionality
    // auto parameters = transformPythonParameters(params, conn.get());
    std::unordered_map<std::string, std::unique_ptr<Value>> parameters;
    auto queryResult =conn->executeWithParams(preparedStatement->preparedStatement.get(), std::move(parameters));
    if (!queryResult->isSuccess()) {
        throw std::runtime_error(queryResult->getErrorMessage());
    }
    auto webQueryResult = std::make_unique<WebQueryResult>();
    webQueryResult->queryResult = std::move(queryResult);
    return webQueryResult;
}

void WebConnection::setMaxNumThreadForExec(uint64_t numThreads) {
    conn->setMaxNumThreadForExec(numThreads);
}

WebPreparedStatement WebConnection::prepare(const std::string& query) {
    auto preparedStatement = conn->prepare(query);
    WebPreparedStatement webPreparedStatement;
    webPreparedStatement.preparedStatement = std::move(preparedStatement);
    return webPreparedStatement;
}

uint64_t WebConnection::getNumNodes(const std::string& nodeName) {
    return storageDriver->getNumNodes(nodeName);
}

uint64_t WebConnection::getNumRels(const std::string& relName) {
    return storageDriver->getNumRels(relName);
}