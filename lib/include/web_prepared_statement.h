#pragma once

#include "main/kuzu.h"
#include "main/prepared_statement.h"

using namespace kuzu::main;

class WebPreparedStatement {
    friend class WebConnection;

public:

    std::string getErrorMessage() const;

    bool isSuccess() const;

private:
    std::unique_ptr<PreparedStatement> preparedStatement;
};
