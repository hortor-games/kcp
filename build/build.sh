/opt/emsdk/upstream/emscripten/tools/webidl_binder kcp.idl glue
emcc -I../ wrap.cpp --post-js glue.js -o ../../kcpconn/src/kcp.asm.js -O3 -s ENVIRONMENT=web -s MODULARIZE -s WASM=0 --memory-init-file=0 -s FILESYSTEM=0 --closure=1 -fno-rtti -fno-exceptions -s ALLOW_MEMORY_GROWTH=1 -s EXPORTED_FUNCTIONS="['_malloc','_free']" -s INITIAL_MEMORY=4MB -s TOTAL_STACK=1MB
