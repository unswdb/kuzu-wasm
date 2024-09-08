#pragma once

#include "main/storage_driver.h"
#include "web_database.h"
#include "web_prepared_statement.h"
#include "web_query_result.h"

class WebConnection {

public:

    explicit WebConnection(WebDatabase* WebDatabase, uint64_t numThreads);

    void close();
    
    ~WebConnection() = default;

    void setQueryTimeout(uint64_t timeoutInMS);

    std::unique_ptr<WebQueryResult> query(std::string queryStatement);

    std::unique_ptr<WebQueryResult> execute(WebPreparedStatement* preparedStatement);

    void setMaxNumThreadForExec(uint64_t numThreads);

    WebPreparedStatement prepare(const std::string& query);

    uint64_t getNumNodes(const std::string& nodeName);

    uint64_t getNumRels(const std::string& relName);

    // void getAllEdgesForTorchGeometric(py::array_t<int64_t>& npArray,
    //     const std::string& srcTableName, const std::string& relName,
    //     const std::string& dstTableName, size_t queryBatchSize);


private:
    std::unique_ptr<StorageDriver> storageDriver;
    std::unique_ptr<Connection> conn;
};

