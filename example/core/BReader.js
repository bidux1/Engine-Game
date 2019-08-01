function BReader()
{
    this.ReadInit32 = function(bytearray, index)
    {
        return ((bytearray[index + 3] << 24) | (bytearray[index + 2] << 16) | (bytearray[index + 1] << 8) | bytearray[index + 0]);
    };
    this.ReadByte = function(bytearray, index)
    {
        return bytearray[index];
    };
}

var BReader = new BReader();