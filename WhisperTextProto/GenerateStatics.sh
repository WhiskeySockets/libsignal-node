yarn pbjs -t static-module -w commonjs -o ./WhisperTextProto/index.js ./WhisperTextProto/WhisperTextProtocol.proto
yarn pbts -o ./WhisperTextProto/index.d.ts ./WhisperTextProto/index.js;