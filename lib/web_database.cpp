#include "include/web_database.h"

#include <memory>

#include "main/version.h"

using namespace kuzu::common;

std::string WebDatabase::getVersion() {
    return Version::getVersion();
}

uint64_t WebDatabase::getStorageVersion() {
    return Version::getStorageVersion();
}

WebDatabase::WebDatabase(const std::string& databasePath, uint64_t bufferPoolSize,
    uint64_t maxNumThreads, bool compression, bool readOnly, uint64_t maxDBSize) {
    auto systemConfig =
        SystemConfig(bufferPoolSize, maxNumThreads, compression, readOnly, maxDBSize);
    database = std::make_unique<Database>(databasePath, systemConfig);
    storageDriver = std::make_unique<kuzu::main::StorageDriver>(database.get());
}

WebDatabase::~WebDatabase() {}
