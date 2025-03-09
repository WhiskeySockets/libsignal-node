class Util {
    static toString(data) {
        if (typeof data === "string") return data;
        return data.toString('base64');
    }
    static isEqual(a, b) {
        if (a == null || b == null) return false;
        a = Util.toString(a);
        b = Util.toString(b);
        const maxLength = Math.max(a.length, b.length);
        if (maxLength < 5) throw new Error("a/b compare too short");
        return a.substring(0, Math.min(maxLength, a.length)) == b.substring(0, Math.min(maxLength, b.length));
    }
}

module.exports = Util;