import * as arrow from 'apache-arrow';
import { DataType } from 'apache-arrow';

var _a;
// Redefine the arrow Type enum to include LargeList, LargeBinary, and LargeUtf8
var Type;
(function (Type) {
    Type[Type["NONE"] = 0] = "NONE"; /** The default placeholder type */
    Type[Type["Null"] = 1] = "Null"; /** A NULL type having no physical storage */
    Type[Type["Int"] = 2] = "Int"; /** Signed or unsigned 8, 16, 32, or 64-bit little-endian integer */
    Type[Type["Float"] = 3] = "Float"; /** 2, 4, or 8-byte floating point value */
    Type[Type["Binary"] = 4] = "Binary"; /** Variable-length bytes (no guarantee of UTF8-ness) */
    Type[Type["Utf8"] = 5] = "Utf8"; /** UTF8 variable-length string as List<Char> */
    Type[Type["Bool"] = 6] = "Bool"; /** Boolean as 1 bit, LSB bit-packed ordering */
    Type[Type["Decimal"] = 7] = "Decimal"; /** Precision-and-scale-based decimal type. Storage type depends on the parameters. */
    Type[Type["Date"] = 8] = "Date"; /** int32_t days or int64_t milliseconds since the UNIX epoch */
    Type[Type["Time"] = 9] = "Time"; /** Time as signed 32 or 64-bit integer, representing either seconds, milliseconds, microseconds, or nanoseconds since midnight since midnight */
    Type[Type["Timestamp"] = 10] = "Timestamp"; /** Exact timestamp encoded with int64 since UNIX epoch (Default unit millisecond) */
    Type[Type["Interval"] = 11] = "Interval"; /** YEAR_MONTH or DAY_TIME interval in SQL style */
    Type[Type["List"] = 12] = "List"; /** A list of some logical data type */
    Type[Type["Struct"] = 13] = "Struct"; /** Struct of logical types */
    Type[Type["Union"] = 14] = "Union"; /** Union of logical types */
    Type[Type["FixedSizeBinary"] = 15] = "FixedSizeBinary"; /** Fixed-size binary. Each value occupies the same number of bytes */
    Type[Type["FixedSizeList"] = 16] = "FixedSizeList"; /** Fixed-size list. Each value occupies the same number of bytes */
    Type[Type["Map"] = 17] = "Map"; /** Map of named logical types */
    Type[Type["Duration"] = 18] = "Duration"; /** Measure of elapsed time in either seconds, milliseconds, microseconds or nanoseconds. */
    Type[Type["LargeBinary"] = 19] = "LargeBinary"; /** Large variable-length bytes (no guarantee of UTF8-ness) */
    Type[Type["LargeUtf8"] = 20] = "LargeUtf8"; /** Large variable-length string as List<Char> */
    // Not yet included in the upstream enum
    Type[Type["LargeList"] = 30] = "LargeList";
    Type[Type["Dictionary"] = -1] = "Dictionary"; /** Dictionary aka Category type */
    Type[Type["Int8"] = -2] = "Int8";
    Type[Type["Int16"] = -3] = "Int16";
    Type[Type["Int32"] = -4] = "Int32";
    Type[Type["Int64"] = -5] = "Int64";
    Type[Type["Uint8"] = -6] = "Uint8";
    Type[Type["Uint16"] = -7] = "Uint16";
    Type[Type["Uint32"] = -8] = "Uint32";
    Type[Type["Uint64"] = -9] = "Uint64";
    Type[Type["Float16"] = -10] = "Float16";
    Type[Type["Float32"] = -11] = "Float32";
    Type[Type["Float64"] = -12] = "Float64";
    Type[Type["DateDay"] = -13] = "DateDay";
    Type[Type["DateMillisecond"] = -14] = "DateMillisecond";
    Type[Type["TimestampSecond"] = -15] = "TimestampSecond";
    Type[Type["TimestampMillisecond"] = -16] = "TimestampMillisecond";
    Type[Type["TimestampMicrosecond"] = -17] = "TimestampMicrosecond";
    Type[Type["TimestampNanosecond"] = -18] = "TimestampNanosecond";
    Type[Type["TimeSecond"] = -19] = "TimeSecond";
    Type[Type["TimeMillisecond"] = -20] = "TimeMillisecond";
    Type[Type["TimeMicrosecond"] = -21] = "TimeMicrosecond";
    Type[Type["TimeNanosecond"] = -22] = "TimeNanosecond";
    Type[Type["DenseUnion"] = -23] = "DenseUnion";
    Type[Type["SparseUnion"] = -24] = "SparseUnion";
    Type[Type["IntervalDayTime"] = -25] = "IntervalDayTime";
    Type[Type["IntervalYearMonth"] = -26] = "IntervalYearMonth";
})(Type || (Type = {}));
class LargeList extends DataType {
    constructor(child) {
        super(Type.LargeList);
        this.children = [child];
    }
    toString() {
        return `LargeList<${this.valueType}>`;
    }
    get valueType() {
        return this.children[0].type;
    }
    get valueField() {
        return this.children[0];
    }
    get ArrayType() {
        return this.valueType.ArrayType;
    }
}
_a = Symbol.toStringTag;
LargeList[_a] = ((proto) => {
    proto.children = null;
    return (proto[Symbol.toStringTag] = "LargeList");
})(LargeList.prototype);
function isLargeList(x) {
    return x?.typeId === Type.LargeList;
}

/**
Parse an [`ArrowArray`](https://arrow.apache.org/docs/format/CDataInterface.html#the-arrowarray-structure) C FFI struct into an [`arrow.Vector`](https://arrow.apache.org/docs/js/classes/Arrow_dom.Vector.html) instance. Multiple `Vector` instances can be joined to make an [`arrow.Table`](https://arrow.apache.org/docs/js/classes/Arrow_dom.Table.html).

- `buffer` (`ArrayBuffer`): The [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Memory) instance to read from.
- `ptr` (`number`): The numeric pointer in `buffer` where the C struct is located.
- `dataType` (`arrow.DataType`): The type of the vector to parse. This is retrieved from `field.type` on the result of `parseField`.
- `copy` (`boolean`, default: `true`): If `true`, will _copy_ data across the Wasm boundary, allowing you to delete the copy on the Wasm side. If `false`, the resulting `arrow.Vector` objects will be _views_ on Wasm memory. This requires careful usage as the arrays will become invalid if the memory region in Wasm changes.

#### Example

```ts
const WASM_MEMORY: WebAssembly.Memory = ...
const copiedVector = parseVector(WASM_MEMORY.buffer, arrayPtr, field.type);
// Make zero-copy views instead of copying array contents
const viewedVector = parseVector(WASM_MEMORY.buffer, arrayPtr, field.type, false);
 */
function parseVector(buffer, ptr, dataType, copy = true) {
    const data = parseData(buffer, ptr, dataType, copy);
    return arrow.makeVector(data);
}
/**
Parse an [`ArrowArray`](https://arrow.apache.org/docs/format/CDataInterface.html#the-arrowarray-structure) C FFI struct into an [`arrow.Data`](https://arrow.apache.org/docs/js/classes/Arrow_dom.Data.html) instance. Multiple `Data` instances can be joined to make an [`arrow.Vector`](https://arrow.apache.org/docs/js/classes/Arrow_dom.Vector.html).

- `buffer` (`ArrayBuffer`): The [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Memory) instance to read from.
- `ptr` (`number`): The numeric pointer in `buffer` where the C struct is located.
- `dataType` (`arrow.DataType`): The type of the vector to parse. This is retrieved from `field.type` on the result of `parseField`.
- `copy` (`boolean`, default: `true`): If `true`, will _copy_ data across the Wasm boundary, allowing you to delete the copy on the Wasm side. If `false`, the resulting `arrow.Data` objects will be _views_ on Wasm memory. This requires careful usage as the arrays will become invalid if the memory region in Wasm changes.

#### Example

```ts
const WASM_MEMORY: WebAssembly.Memory = ...
const copiedData = parseData(WASM_MEMORY.buffer, arrayPtr, field.type);
// Make zero-copy views instead of copying array contents
const viewedData = parseData(WASM_MEMORY.buffer, arrayPtr, field.type, false);
```
 */
function parseData(buffer, ptr, dataType, copy = true) {
    const dataView = new DataView(buffer);
    const length = Number(dataView.getBigInt64(ptr, true));
    const nullCount = Number(dataView.getBigInt64(ptr + 8, true));
    // TODO: if copying to a JS owned buffer, should this offset always be 0?
    const offset = Number(dataView.getBigInt64(ptr + 16, true));
    const nBuffers = Number(dataView.getBigInt64(ptr + 24, true));
    const nChildren = Number(dataView.getBigInt64(ptr + 32, true));
    const ptrToBufferPtrs = dataView.getUint32(ptr + 40, true);
    const bufferPtrs = new Uint32Array(Number(nBuffers));
    for (let i = 0; i < nBuffers; i++) {
        bufferPtrs[i] = dataView.getUint32(ptrToBufferPtrs + i * 4, true);
    }
    const ptrToChildrenPtrs = dataView.getUint32(ptr + 44, true);
    const dictionaryPtr = dataView.getUint32(ptr + 48, true);
    const children = new Array(Number(nChildren));
    for (let i = 0; i < nChildren; i++) {
        children[i] = parseData(buffer, dataView.getUint32(ptrToChildrenPtrs + i * 4, true), dataType.children[i].type, copy);
    }
    // Special case for handling dictionary-encoded arrays
    if (dictionaryPtr !== 0) {
        const dictionaryType = dataType;
        // the parent structure points to the index data, the ArrowArray.dictionary
        // points to the dictionary values array.
        const indicesType = dictionaryType.indices;
        const dictionaryIndices = parseDataContent({
            dataType: indicesType,
            dataView,
            copy,
            length,
            nullCount,
            offset,
            nChildren,
            children,
            bufferPtrs,
        });
        const valueType = dictionaryType.dictionary.type;
        const dictionaryValues = parseData(buffer, dictionaryPtr, valueType, copy);
        // @ts-expect-error we're casting to dictionary type
        return arrow.makeData({
            type: dictionaryType,
            // TODO: double check that this offset should be set on both the values
            // and indices of the dictionary array
            offset,
            length,
            nullCount,
            nullBitmap: dictionaryIndices.nullBitmap,
            // Note: Here we need to pass in the _raw TypedArray_ not a Data instance
            data: dictionaryIndices.values,
            dictionary: arrow.makeVector(dictionaryValues),
        });
    }
    else {
        return parseDataContent({
            dataType,
            dataView,
            copy,
            length,
            nullCount,
            offset,
            nChildren,
            children,
            bufferPtrs,
        });
    }
}
function parseDataContent({ dataType, dataView, copy, length, nullCount, offset, nChildren, children, bufferPtrs, }) {
    if (DataType.isNull(dataType)) {
        return arrow.makeData({
            type: dataType,
            offset,
            length,
        });
    }
    if (DataType.isInt(dataType)) {
        const [validityPtr, dataPtr] = bufferPtrs;
        const nullBitmap = parseNullBitmap(dataView.buffer, validityPtr, length, copy);
        const byteLength = (length * dataType.bitWidth) / 8;
        const data = copy
            ? new dataType.ArrayType(copyBuffer(dataView.buffer, dataPtr, byteLength))
            : new dataType.ArrayType(dataView.buffer, dataPtr, length);
        return arrow.makeData({
            type: dataType,
            offset,
            length,
            nullCount,
            data,
            nullBitmap,
        });
    }
    if (DataType.isFloat(dataType)) {
        const [validityPtr, dataPtr] = bufferPtrs;
        const nullBitmap = parseNullBitmap(dataView.buffer, validityPtr, length, copy);
        // bitwidth doesn't exist on float types I guess
        const byteLength = length * dataType.ArrayType.BYTES_PER_ELEMENT;
        const data = copy
            ? new dataType.ArrayType(copyBuffer(dataView.buffer, dataPtr, byteLength))
            : new dataType.ArrayType(dataView.buffer, dataPtr, length);
        return arrow.makeData({
            type: dataType,
            offset,
            length,
            nullCount,
            data,
            nullBitmap,
        });
    }
    if (DataType.isBool(dataType)) {
        const [validityPtr, dataPtr] = bufferPtrs;
        const nullBitmap = parseNullBitmap(dataView.buffer, validityPtr, length, copy);
        // Boolean arrays are bit-packed. This means the byte length should be the number of elements,
        // rounded up to the nearest byte to account for the remainder.
        const byteLength = Math.ceil(length / 8);
        const data = copy
            ? new dataType.ArrayType(copyBuffer(dataView.buffer, dataPtr, byteLength))
            : new dataType.ArrayType(dataView.buffer, dataPtr, length);
        return arrow.makeData({
            type: dataType,
            offset,
            length,
            nullCount,
            data,
            nullBitmap,
        });
    }
    if (DataType.isDecimal(dataType)) {
        const [validityPtr, dataPtr] = bufferPtrs;
        const nullBitmap = parseNullBitmap(dataView.buffer, validityPtr, length, copy);
        const byteLength = (length * dataType.bitWidth) / 8;
        const data = copy
            ? new dataType.ArrayType(copyBuffer(dataView.buffer, dataPtr, byteLength))
            : new dataType.ArrayType(dataView.buffer, dataPtr, length);
        return arrow.makeData({
            type: dataType,
            offset,
            length,
            nullCount,
            data,
            nullBitmap,
        });
    }
    if (DataType.isDate(dataType)) {
        const [validityPtr, dataPtr] = bufferPtrs;
        const nullBitmap = parseNullBitmap(dataView.buffer, validityPtr, length, copy);
        let byteWidth = getDateByteWidth(dataType);
        const data = copy
            ? new dataType.ArrayType(copyBuffer(dataView.buffer, dataPtr, length * byteWidth))
            : new dataType.ArrayType(dataView.buffer, dataPtr, length);
        return arrow.makeData({
            type: dataType,
            offset,
            length,
            nullCount,
            data,
            nullBitmap,
        });
    }
    if (DataType.isTime(dataType)) {
        const [validityPtr, dataPtr] = bufferPtrs;
        const nullBitmap = parseNullBitmap(dataView.buffer, validityPtr, length, copy);
        const byteLength = (length * dataType.bitWidth) / 8;
        const data = copy
            ? new dataType.ArrayType(copyBuffer(dataView.buffer, dataPtr, byteLength))
            : new dataType.ArrayType(dataView.buffer, dataPtr, length);
        return arrow.makeData({
            type: dataType,
            offset,
            length,
            nullCount,
            data,
            nullBitmap,
        });
    }
    if (DataType.isTimestamp(dataType)) {
        const [validityPtr, dataPtr] = bufferPtrs;
        const nullBitmap = parseNullBitmap(dataView.buffer, validityPtr, length, copy);
        let byteWidth = getTimeByteWidth(dataType);
        const data = copy
            ? new dataType.ArrayType(copyBuffer(dataView.buffer, dataPtr, length * byteWidth))
            : new dataType.ArrayType(dataView.buffer, dataPtr, length);
        return arrow.makeData({
            type: dataType,
            offset,
            length,
            nullCount,
            data,
            nullBitmap,
        });
    }
    if (DataType.isDuration(dataType)) {
        const [validityPtr, dataPtr] = bufferPtrs;
        const nullBitmap = parseNullBitmap(dataView.buffer, validityPtr, length, copy);
        let byteWidth = getTimeByteWidth(dataType);
        const data = copy
            ? new dataType.ArrayType(copyBuffer(dataView.buffer, dataPtr, length * byteWidth))
            : new dataType.ArrayType(dataView.buffer, dataPtr, length);
        return arrow.makeData({
            type: dataType,
            offset,
            length,
            nullCount,
            data,
            nullBitmap,
        });
    }
    if (DataType.isInterval(dataType)) {
        const [validityPtr, dataPtr] = bufferPtrs;
        const nullBitmap = parseNullBitmap(dataView.buffer, validityPtr, length, copy);
        // What's the bitwidth here?
        if (copy) {
            throw new Error("Not yet implemented");
        }
        const data = copy
            ? new dataType.ArrayType(copyBuffer(dataView.buffer, dataPtr, length))
            : new dataType.ArrayType(dataView.buffer, dataPtr, length);
        return arrow.makeData({
            type: dataType,
            offset,
            length,
            nullCount,
            data,
            nullBitmap,
        });
    }
    if (DataType.isBinary(dataType)) {
        const [validityPtr, offsetsPtr, dataPtr] = bufferPtrs;
        const nullBitmap = parseNullBitmap(dataView.buffer, validityPtr, length, copy);
        const valueOffsets = copy
            ? new Int32Array(copyBuffer(dataView.buffer, offsetsPtr, (length + 1) * Int32Array.BYTES_PER_ELEMENT))
            : new Int32Array(dataView.buffer, offsetsPtr, length + 1);
        // The length described in pointer is the number of elements. The last element in `valueOffsets`
        // stores the maximum offset in the buffer and thus the byte length
        const byteLength = valueOffsets[valueOffsets.length - 1];
        const data = copy
            ? new dataType.ArrayType(copyBuffer(dataView.buffer, dataPtr, byteLength))
            : new dataType.ArrayType(dataView.buffer, dataPtr, byteLength);
        return arrow.makeData({
            type: dataType,
            offset,
            length,
            nullCount,
            nullBitmap,
            valueOffsets,
            data,
        });
    }
    if (DataType.isLargeBinary(dataType)) {
        const [validityPtr, offsetsPtr, dataPtr] = bufferPtrs;
        const nullBitmap = parseNullBitmap(dataView.buffer, validityPtr, length, copy);
        // The original value offsets are an Int64Array, which Arrow JS does not yet support natively
        const originalValueOffsets = new BigInt64Array(dataView.buffer, offsetsPtr, length + 1);
        // Copy the Int64Array to an Int32Array
        const valueOffsets = new Int32Array(length + 1);
        for (let i = 0; i < originalValueOffsets.length; i++) {
            valueOffsets[i] = Number(originalValueOffsets[i]);
        }
        // The length described in pointer is the number of elements. The last element in `valueOffsets`
        // stores the maximum offset in the buffer and thus the byte length
        const byteLength = valueOffsets[valueOffsets.length - 1];
        const data = copy
            ? new Uint8Array(copyBuffer(dataView.buffer, dataPtr, byteLength))
            : new Uint8Array(dataView.buffer, dataPtr, byteLength);
        // @ts-expect-error The return type is inferred wrong because we're coercing from a LargeBinary
        // to a Binary
        return arrow.makeData({
            type: new arrow.Binary(),
            offset,
            length,
            nullCount,
            nullBitmap,
            valueOffsets,
            data,
        });
    }
    if (DataType.isUtf8(dataType)) {
        const [validityPtr, offsetsPtr, dataPtr] = bufferPtrs;
        const nullBitmap = parseNullBitmap(dataView.buffer, validityPtr, length, copy);
        const valueOffsets = copy
            ? new Int32Array(copyBuffer(dataView.buffer, offsetsPtr, (length + 1) * Int32Array.BYTES_PER_ELEMENT))
            : new Int32Array(dataView.buffer, offsetsPtr, length + 1);
        // The length described in pointer is the number of elements. The last element in `valueOffsets`
        // stores the maximum offset in the buffer and thus the byte length
        const byteLength = valueOffsets[valueOffsets.length - 1];
        const data = copy
            ? new dataType.ArrayType(copyBuffer(dataView.buffer, dataPtr, byteLength))
            : new dataType.ArrayType(dataView.buffer, dataPtr, byteLength);
        return arrow.makeData({
            type: dataType,
            offset,
            length,
            nullCount,
            nullBitmap,
            valueOffsets,
            data,
        });
    }
    if (DataType.isLargeUtf8(dataType)) {
        const [validityPtr, offsetsPtr, dataPtr] = bufferPtrs;
        const nullBitmap = parseNullBitmap(dataView.buffer, validityPtr, length, copy);
        // The original value offsets are an Int64Array, which Arrow JS does not yet support natively
        const originalValueOffsets = new BigInt64Array(dataView.buffer, offsetsPtr, length + 1);
        // Copy the Int64Array to an Int32Array
        const valueOffsets = new Int32Array(length + 1);
        for (let i = 0; i < originalValueOffsets.length; i++) {
            valueOffsets[i] = Number(originalValueOffsets[i]);
        }
        // The length described in pointer is the number of elements. The last element in `valueOffsets`
        // stores the maximum offset in the buffer and thus the byte length
        const byteLength = valueOffsets[valueOffsets.length - 1];
        const data = copy
            ? new Uint8Array(copyBuffer(dataView.buffer, dataPtr, byteLength))
            : new Uint8Array(dataView.buffer, dataPtr, byteLength);
        // @ts-expect-error The return type is inferred wrong because we're coercing from a LargeUtf8 to
        // a Utf8
        return arrow.makeData({
            type: new arrow.Utf8(),
            offset,
            length,
            nullCount,
            nullBitmap,
            valueOffsets,
            data,
        });
    }
    if (DataType.isFixedSizeBinary(dataType)) {
        const [validityPtr, dataPtr] = bufferPtrs;
        const nullBitmap = parseNullBitmap(dataView.buffer, validityPtr, length, copy);
        const data = copy
            ? new dataType.ArrayType(copyBuffer(dataView.buffer, dataPtr, length * dataType.byteWidth))
            : new dataType.ArrayType(dataView.buffer, dataPtr, length * dataType.byteWidth);
        return arrow.makeData({
            type: dataType,
            offset,
            length,
            nullCount,
            nullBitmap,
            data,
        });
    }
    if (DataType.isList(dataType)) {
        assert(nChildren === 1);
        const [validityPtr, offsetsPtr] = bufferPtrs;
        const nullBitmap = parseNullBitmap(dataView.buffer, validityPtr, length, copy);
        const valueOffsets = copy
            ? new Int32Array(copyBuffer(dataView.buffer, offsetsPtr, (length + 1) * Int32Array.BYTES_PER_ELEMENT))
            : new Int32Array(dataView.buffer, offsetsPtr, length + 1);
        return arrow.makeData({
            type: dataType,
            offset,
            length,
            nullCount,
            nullBitmap,
            valueOffsets,
            child: children[0],
        });
    }
    if (isLargeList(dataType)) {
        assert(nChildren === 1);
        const [validityPtr, offsetsPtr] = bufferPtrs;
        const nullBitmap = parseNullBitmap(dataView.buffer, validityPtr, length, copy);
        // The original value offsets are an Int64Array, which Arrow JS does not yet support natively
        const originalValueOffsets = new BigInt64Array(dataView.buffer, offsetsPtr, length + 1);
        // Copy the Int64Array to an Int32Array
        const valueOffsets = new Int32Array(length + 1);
        for (let i = 0; i < originalValueOffsets.length; i++) {
            valueOffsets[i] = Number(originalValueOffsets[i]);
        }
        // @ts-expect-error The return type is inferred wrong because we're coercing from a LargeList to
        // a List
        return arrow.makeData({
            type: new arrow.List(dataType.children[0]),
            offset,
            length,
            nullCount,
            nullBitmap,
            valueOffsets,
            child: children[0],
        });
    }
    if (DataType.isFixedSizeList(dataType)) {
        assert(nChildren === 1);
        const [validityPtr] = bufferPtrs;
        const nullBitmap = parseNullBitmap(dataView.buffer, validityPtr, length, copy);
        return arrow.makeData({
            type: dataType,
            offset,
            length,
            nullCount,
            nullBitmap,
            child: children[0],
        });
    }
    if (DataType.isStruct(dataType)) {
        const [validityPtr] = bufferPtrs;
        const nullBitmap = parseNullBitmap(dataView.buffer, validityPtr, length, copy);
        return arrow.makeData({
            type: dataType,
            offset,
            length,
            nullCount,
            nullBitmap,
            children,
        });
    }
    if (DataType.isMap(dataType)) {
        assert(nChildren === 1);
        const [validityPtr, offsetsPtr] = bufferPtrs;
        const nullBitmap = parseNullBitmap(dataView.buffer, validityPtr, length, copy);
        const valueOffsets = copy
            ? new Int32Array(copyBuffer(dataView.buffer, offsetsPtr, (length + 1) * Int32Array.BYTES_PER_ELEMENT))
            : new Int32Array(dataView.buffer, offsetsPtr, length + 1);
        return arrow.makeData({
            type: dataType,
            offset,
            length,
            nullCount,
            nullBitmap,
            valueOffsets,
            child: children[0],
        });
    }
    if (DataType.isDenseUnion(dataType)) {
        const [typeIdsPtr, offsetsPtr] = bufferPtrs;
        const valueOffsets = copy
            ? new Int32Array(copyBuffer(dataView.buffer, offsetsPtr, (length + 1) * Int32Array.BYTES_PER_ELEMENT))
            : new Int32Array(dataView.buffer, offsetsPtr, length + 1);
        const typeIds = copy
            ? new Int8Array(copyBuffer(dataView.buffer, typeIdsPtr, (length + 1) * Int8Array.BYTES_PER_ELEMENT))
            : new Int8Array(dataView.buffer, typeIdsPtr, length + 1);
        return arrow.makeData({
            type: dataType,
            offset,
            length,
            nullCount,
            typeIds,
            children,
            valueOffsets,
        });
    }
    if (DataType.isSparseUnion(dataType)) {
        const [typeIdsPtr] = bufferPtrs;
        const typeIds = copy
            ? new Int8Array(copyBuffer(dataView.buffer, typeIdsPtr, (length + 1) * Int8Array.BYTES_PER_ELEMENT))
            : new Int8Array(dataView.buffer, typeIdsPtr, length + 1);
        return arrow.makeData({
            type: dataType,
            offset,
            length,
            nullCount,
            typeIds,
            children,
        });
    }
    throw new Error(`Unsupported type ${dataType}`);
}
function getDateByteWidth(type) {
    switch (type.unit) {
        case arrow.DateUnit.DAY:
            return 4;
        case arrow.DateUnit.MILLISECOND:
            return 8;
    }
    assertUnreachable();
}
function getTimeByteWidth(type) {
    switch (type.unit) {
        case arrow.TimeUnit.SECOND:
        case arrow.TimeUnit.MILLISECOND:
            return 4;
        case arrow.TimeUnit.MICROSECOND:
        case arrow.TimeUnit.NANOSECOND:
            return 8;
    }
    assertUnreachable();
}
function parseNullBitmap(buffer, validityPtr, length, copy) {
    if (validityPtr === 0) {
        return null;
    }
    // Each value takes up one bit
    const byteLength = (length >> 3) + 1;
    if (copy) {
        return new Uint8Array(copyBuffer(buffer, validityPtr, byteLength));
    }
    else {
        return new Uint8Array(buffer, validityPtr, byteLength);
    }
}
/** Copy existing buffer into new buffer */
function copyBuffer(buffer, ptr, byteLength) {
    const newBuffer = new ArrayBuffer(byteLength);
    const newBufferView = new Uint8Array(newBuffer);
    const existingView = new Uint8Array(buffer, ptr, byteLength);
    newBufferView.set(existingView);
    return newBuffer;
}
function assert(a) {
    if (!a)
        throw new Error(`assertion failed`);
}
function assertUnreachable() {
    throw new Error();
}

// @ts-nocheck
const UTF8_DECODER = new TextDecoder("utf-8");
// Note: it looks like duration types don't yet exist in Arrow JS
const formatMapping = {
    n: new arrow.Null(),
    b: new arrow.Bool(),
    c: new arrow.Int8(),
    C: new arrow.Uint8(),
    s: new arrow.Int16(),
    S: new arrow.Uint16(),
    i: new arrow.Int32(),
    I: new arrow.Uint32(),
    l: new arrow.Int64(),
    L: new arrow.Uint64(),
    e: new arrow.Float16(),
    f: new arrow.Float32(),
    g: new arrow.Float64(),
    z: new arrow.Binary(),
    Z: new arrow.LargeBinary(),
    u: new arrow.Utf8(),
    U: new arrow.LargeUtf8(),
    tdD: new arrow.DateDay(),
    tdm: new arrow.DateMillisecond(),
    tts: new arrow.TimeSecond(),
    ttm: new arrow.TimeMillisecond(),
    ttu: new arrow.TimeMicrosecond(),
    ttn: new arrow.TimeNanosecond(),
    tiM: new arrow.Interval(arrow.IntervalUnit.YEAR_MONTH),
    tiD: new arrow.Interval(arrow.IntervalUnit.DAY_TIME),
    tin: new arrow.Interval(arrow.IntervalUnit.MONTH_DAY_NANO),
};
/**
Parse an [`ArrowSchema`](https://arrow.apache.org/docs/format/CDataInterface.html#the-arrowschema-structure) C FFI struct into an `arrow.Field` instance. The `Field` is necessary for later using `parseVector` below.

- `buffer` (`ArrayBuffer`): The [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Memory) instance to read from.
- `ptr` (`number`): The numeric pointer in `buffer` where the C struct is located.
 */
function parseField(buffer, ptr) {
    const dataView = new DataView(buffer);
    const formatPtr = dataView.getUint32(ptr, true);
    const formatString = parseNullTerminatedString(dataView, formatPtr);
    const namePtr = dataView.getUint32(ptr + 4, true);
    const metadataPtr = dataView.getUint32(ptr + 8, true);
    const name = parseNullTerminatedString(dataView, namePtr);
    const metadata = parseMetadata(dataView, metadataPtr);
    // Extra 4 to be 8-byte aligned
    const flags = parseFlags(dataView.getBigInt64(ptr + 16, true));
    const nChildren = dataView.getBigInt64(ptr + 24, true);
    const ptrToChildrenPtrs = dataView.getUint32(ptr + 32, true);
    const dictionaryPtr = dataView.getUint32(ptr + 36, true);
    const childrenFields = new Array(Number(nChildren));
    for (let i = 0; i < nChildren; i++) {
        childrenFields[i] = parseField(buffer, dataView.getUint32(ptrToChildrenPtrs + i * 4, true));
    }
    const field = parseFieldContent({
        formatString,
        flags,
        name,
        childrenFields,
        metadata,
    });
    if (dictionaryPtr !== 0) {
        const dictionaryValuesField = parseField(buffer, dictionaryPtr);
        const dictionaryType = new arrow.Dictionary(dictionaryValuesField, field.type, null, flags.dictionaryOrdered);
        return new arrow.Field(field.name, dictionaryType, flags.nullable, metadata);
    }
    return field;
}
function parseFieldContent({ formatString, flags, name, childrenFields, metadata, }) {
    const primitiveType = formatMapping[formatString];
    if (primitiveType) {
        return new arrow.Field(name, primitiveType, flags.nullable, metadata);
    }
    // decimal
    if (formatString.slice(0, 2) === "d:") {
        const parts = formatString.slice(2).split(",");
        const precision = parseInt(parts[0]);
        const scale = parseInt(parts[1]);
        const bitWidth = parts[2] ? parseInt(parts[2]) : undefined;
        const type = new arrow.Decimal(scale, precision, bitWidth);
        return new arrow.Field(name, type, flags.nullable, metadata);
    }
    // timestamp
    if (formatString.slice(0, 2) === "ts") {
        let timeUnit = null;
        switch (formatString[2]) {
            case "s":
                timeUnit = arrow.TimeUnit.SECOND;
                break;
            case "m":
                timeUnit = arrow.TimeUnit.MILLISECOND;
                break;
            case "u":
                timeUnit = arrow.TimeUnit.MICROSECOND;
                break;
            case "n":
                timeUnit = arrow.TimeUnit.NANOSECOND;
                break;
            default:
                throw new Error(`invalid timestamp ${formatString}`);
        }
        assert(formatString[3] === ":");
        let timezone = null;
        if (formatString.length > 4) {
            timezone = formatString.slice(4);
        }
        const type = new arrow.Timestamp(timeUnit, timezone);
        return new arrow.Field(name, type, flags.nullable, metadata);
    }
    // duration
    if (formatString.slice(0, 2) === "tD") {
        let timeUnit = null;
        switch (formatString[2]) {
            case "s":
                timeUnit = arrow.TimeUnit.SECOND;
                break;
            case "m":
                timeUnit = arrow.TimeUnit.MILLISECOND;
                break;
            case "u":
                timeUnit = arrow.TimeUnit.MICROSECOND;
                break;
            case "n":
                timeUnit = arrow.TimeUnit.NANOSECOND;
                break;
            default:
                throw new Error(`invalid timestamp ${formatString}`);
        }
        const type = new arrow.Duration(timeUnit);
        return new arrow.Field(name, type, flags.nullable, metadata);
    }
    // struct
    if (formatString === "+s") {
        const type = new arrow.Struct(childrenFields);
        return new arrow.Field(name, type, flags.nullable, metadata);
    }
    // list
    if (formatString === "+l") {
        assert(childrenFields.length === 1);
        const type = new arrow.List(childrenFields[0]);
        return new arrow.Field(name, type, flags.nullable, metadata);
    }
    // large list
    if (formatString === "+L") {
        assert(childrenFields.length === 1);
        const type = new LargeList(childrenFields[0]);
        return new arrow.Field(name, type, flags.nullable, metadata);
    }
    // FixedSizeBinary
    if (formatString.slice(0, 2) === "w:") {
        // The size of the binary is the integer after the colon
        const byteWidth = parseInt(formatString.slice(2));
        const type = new arrow.FixedSizeBinary(byteWidth);
        return new arrow.Field(name, type, flags.nullable, metadata);
    }
    // FixedSizeList
    if (formatString.slice(0, 3) === "+w:") {
        assert(childrenFields.length === 1);
        // The size of the list is the integer after the colon
        const innerSize = parseInt(formatString.slice(3));
        const type = new arrow.FixedSizeList(innerSize, childrenFields[0]);
        return new arrow.Field(name, type, flags.nullable, metadata);
    }
    // Map
    if (formatString === "+m") {
        assert(childrenFields.length === 1);
        const type = new arrow.Map_(childrenFields[0], flags.mapKeysSorted);
        return new arrow.Field(name, type, flags.nullable, metadata);
    }
    // Dense union
    if (formatString.slice(0, 4) === "+ud:") {
        const typeIds = formatString.slice(4).split(",").map(Number);
        const type = new arrow.DenseUnion(typeIds, childrenFields);
        return new arrow.Field(name, type, flags.nullable, metadata);
    }
    // Sparse union
    if (formatString.slice(0, 4) === "+us:") {
        const typeIds = formatString.slice(4).split(",").map(Number);
        const type = new arrow.SparseUnion(typeIds, childrenFields);
        return new arrow.Field(name, type, flags.nullable, metadata);
    }
    throw new Error(`Unsupported format: ${formatString}`);
}
function parseFlags(flag) {
    if (flag === 0n) {
        return {
            nullable: false,
            dictionaryOrdered: false,
            mapKeysSorted: false,
        };
    }
    // https://stackoverflow.com/a/9954810
    let parsed = flag.toString(2);
    return {
        nullable: parsed[0] === "1" ? true : false,
        dictionaryOrdered: parsed[1] === "1" ? true : false,
        mapKeysSorted: parsed[2] === "1" ? true : false,
    };
}
/** Parse a null-terminated C-style string */
function parseNullTerminatedString(dataView, ptr, maxBytesToRead = Infinity) {
    const maxPtr = Math.min(ptr + maxBytesToRead, dataView.byteLength);
    let end = ptr;
    while (end < maxPtr && dataView.getUint8(end) !== 0) {
        end += 1;
    }
    // return UTF8_DECODER.decode(new Uint8Array(dataView.buffer, ptr, end - ptr));
    const length = end - ptr;
    const bufferCopy = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
        bufferCopy[i] = dataView.getUint8(ptr + i);
    }
    return UTF8_DECODER.decode(bufferCopy);
}
/**
 * Parse field metadata
 *
 * The metadata format is described here:
 * https://arrow.apache.org/docs/format/CDataInterface.html#c.ArrowSchema.metadata
 */
function parseMetadata(dataView, ptr) {
    const numEntries = dataView.getInt32(ptr, true);
    if (numEntries === 0) {
        return null;
    }
    const metadata = new Map();
    ptr += 4;
    for (let i = 0; i < numEntries; i++) {
        const keyByteLength = dataView.getInt32(ptr, true);
        ptr += 4;
        const key = UTF8_DECODER.decode(new Uint8Array(dataView.buffer, ptr, keyByteLength));
        ptr += keyByteLength;
        const valueByteLength = dataView.getInt32(ptr, true);
        ptr += 4;
        const value = UTF8_DECODER.decode(new Uint8Array(dataView.buffer, ptr, valueByteLength));
        ptr += valueByteLength;
        metadata.set(key, value);
    }
    return metadata;
}

/**
Parse an [`ArrowSchema`](https://arrow.apache.org/docs/format/CDataInterface.html#the-arrowschema-structure) C FFI struct into an `arrow.Schema` instance. Note that the underlying field **must** be a `Struct` type. In essence a `Struct` field is used to mimic a `Schema` while only being one field.

- `buffer` (`ArrayBuffer`): The [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Memory) instance to read from.
- `ptr` (`number`): The numeric pointer in `buffer` where the C struct is located.

```js
const WASM_MEMORY: WebAssembly.Memory = ...
const schema = parseSchema(WASM_MEMORY.buffer, fieldPtr);
```
 */
function parseSchema(buffer, ptr) {
    const field = parseField(buffer, ptr);
    if (!isStructField(field)) {
        throw new Error("Expected struct");
    }
    return unpackStructField(field);
}
function isStructField(field) {
    return field.typeId == arrow.Type.Struct;
}
function unpackStructField(field) {
    const fields = field.type.children;
    const metadata = field.metadata;
    // TODO: support dictionaries parameter for dictionary-encoded arrays
    return new arrow.Schema(fields, metadata);
}

/**
Parse an [`ArrowArray`](https://arrow.apache.org/docs/format/CDataInterface.html#the-arrowarray-structure) C FFI struct _plus_ an [`ArrowSchema`](https://arrow.apache.org/docs/format/CDataInterface.html#the-arrowschema-structure) C FFI struct into an `arrow.RecordBatch` instance. Note that the underlying array and field **must** be a `Struct` type. In essence a `Struct` array is used to mimic a `RecordBatch` while only being one array.

- `buffer` (`ArrayBuffer`): The [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Memory) instance to read from.
- `arrayPtr` (`number`): The numeric pointer in `buffer` where the _array_ C struct is located.
- `schemaPtr` (`number`): The numeric pointer in `buffer` where the _field_ C struct is located.
- `copy` (`boolean`, default: `true`): If `true`, will _copy_ data across the Wasm boundary, allowing you to delete the copy on the Wasm side. If `false`, the resulting `arrow.Vector` objects will be _views_ on Wasm memory. This requires careful usage as the arrays will become invalid if the memory region in Wasm changes.

#### Example

```ts
const WASM_MEMORY: WebAssembly.Memory = ...
const copiedRecordBatch = parseRecordBatch(
    WASM_MEMORY.buffer,
    arrayPtr,
    fieldPtr
);
// Pass `false` to view arrays across the boundary instead of creating copies.
const viewedRecordBatch = parseRecordBatch(
    WASM_MEMORY.buffer,
    arrayPtr,
    fieldPtr,
    false
);
```
 */
function parseRecordBatch(buffer, arrayPtr, schemaPtr, copy = true) {
    const schema = parseSchema(buffer, schemaPtr);
    const data = parseData(buffer, arrayPtr, new arrow.Struct(schema.fields), copy);
    return new arrow.RecordBatch(schema, data);
}

/**
Parse an Arrow Table object from WebAssembly memory to an Arrow JS `Table`.

This expects an array of [`ArrowArray`](https://arrow.apache.org/docs/format/CDataInterface.html#the-arrowarray-structure) C FFI structs _plus_ an [`ArrowSchema`](https://arrow.apache.org/docs/format/CDataInterface.html#the-arrowschema-structure) C FFI struct. Note that the underlying array and field pointers **must** be a `Struct` type. In essence a `Struct` array is used to mimic each `RecordBatch` while only being one array.

- `buffer` (`ArrayBuffer`): The [`WebAssembly.Memory`](https://developer.mozilla.org/en-US/docs/WebAssembly/JavaScript_interface/Memory) instance to read from.
- `arrayPtrs` (`number[]`): An array of numeric pointers describing the location in `buffer` where the _array_ C struct is located that represents each record batch.
- `schemaPtr` (`number`): The numeric pointer in `buffer` where the _field_ C struct is located.
- `copy` (`boolean`, default: `true`): If `true`, will _copy_ data across the Wasm boundary, allowing you to delete the copy on the Wasm side. If `false`, the resulting `arrow.Vector` objects will be _views_ on Wasm memory. This requires careful usage as the arrays will become invalid if the memory region in Wasm changes.
 */
function parseTable(buffer, arrayPtrs, schemaPtr, copy = true) {
    const schema = parseSchema(buffer, schemaPtr);
    const batches = [];
    for (let i = 0; i < arrayPtrs.length; i++) {
        const structData = parseData(buffer, arrayPtrs[i], new arrow.Struct(schema.fields), copy);
        const recordBatch = new arrow.RecordBatch(schema, structData);
        batches.push(recordBatch);
    }
    return new arrow.Table(schema, batches);
}

export { parseData, parseField, parseRecordBatch, parseSchema, parseTable, parseVector };
//# sourceMappingURL=arrow-js-ffi.es.mjs.map
