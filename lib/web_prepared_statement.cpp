#include "include/web_prepared_statement.h"

#include "binder/binder.h"
#include "planner/operator/logical_plan.h"


std::string WebPreparedStatement::getErrorMessage() const {
    return preparedStatement->getErrorMessage();
}

bool WebPreparedStatement::isSuccess() const {
    return preparedStatement->isSuccess();
}
