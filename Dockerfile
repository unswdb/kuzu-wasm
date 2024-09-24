# Use the official Emscripten base image
FROM emscripten/emsdk:latest

# Set maintainer information
LABEL maintainer="lantu.april@gmail.com"

# Copy the current directory contents into the container at /kuzu-wasm
COPY . /kuzu-wasm

# Install the necessary packages
RUN apt-get update && \
    npm install -g yarn  # Install Yarn globally using npm

# Verify the installation of Emscripten, Node.js, and Yarn
RUN emcc -v && node -v && yarn -v  # Check versions

# Set the working directory to /kuzu-wasm
WORKDIR /kuzu-wasm

# Install kuzu-wasm and build package
RUN make package

# Remove the unnecessary files
RUN rm -rf /kuzu-wasm/kuzu/dataset

# Set the default command to run when starting the container
CMD ["/bin/bash"]
