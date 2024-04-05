cmake_minimum_required(VERSION 3.10)
project(NewKuzu)
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_CXX_STANDARD_REQUIRED TRUE)

if (EMSCRIPTEN)
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -pthread")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -sUSE_PTHREADS=1")
    set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} -mbulk-memory -DWEBDB_BULK_MEMORY=1")
    add_compile_options("SHELL:-s USE_PTHREADS")
    add_link_options("SHELL:-s USE_PTHREADS")
endif()

add_subdirectory(kuzu)

# include_directories("/Users/gaogao/github/emsdk/upstream/emscripten/system/include")

include_directories(lib)

add_executable(main lib/web_bind.cpp lib/web_database.cpp lib/web_connection.cpp lib/web_prepared_statement.cpp lib/web_query_result.cpp)

target_link_libraries(main kuzu)

set_target_properties(
  main
  PROPERTIES
    LINK_FLAGS
    "-s FILESYSTEM=1 \
    -s ALLOW_MEMORY_GROWTH \
    -s MAXIMUM_MEMORY=4GB \
    -s ALLOW_BLOCKING_ON_MAIN_THREAD=1 \
    -s PTHREAD_POOL_SIZE=navigator.hardwareConcurrency \
    -mbulk-memory -DWEBDB_BULK_MEMORY=1 \
    -sWASM_BIGINT \
    -s ERROR_ON_UNDEFINED_SYMBOLS=0 \
    -lembind \
    -sASSERTIONS=1 \
    -sSAFE_HEAP=1 \
    -g \
    -sNO_DISABLE_EXCEPTION_CATCHING \
    --embed-file ../kuzu/dataset/demo-db/csv \
    -s EXPORTED_RUNTIME_METHODS='[\"ccall\", \"stackSave\", \"stackAlloc\", \"stackRestore\"]' \
    ")
    # -s ALLOW_BLOCKING_ON_MAIN_THREAD=1 \
    # -sUSE_PTHREADS=1 -sPTHREAD_POOL_SIZE=4 \
    # -s PTHREAD_POOL_SIZE_STRICT=0
    # -s PROXY_TO_PTHREAD \