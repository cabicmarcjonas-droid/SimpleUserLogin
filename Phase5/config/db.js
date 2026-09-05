const mongoose = require("mongoose");

async function connectDB(uri) {
  const isPlaceholder =
    !uri ||
    uri.includes("xxxxx") ||
    /PASSWORD/i.test(uri) ||
    uri.includes("<") ||
    uri.includes(">") ||
    /<.*password.*>/i.test(uri);

  if (isPlaceholder) {
    console.warn(
      "[DB] MONGODB_URI is placeholder (still contains <db_password> / xxxxx / PASSWORD). Set real URI in Phase5/.env — server will run without DB until then.",
    );
    return null;
  }
  // Check DB name — handle both SRV (mongodb+srv://...net/userlogin?) and non-SRV (mongodb://...net:27017,.../userlogin?)
  const hasDbName = uri.includes("/userlogin") || /\/[^\/]+\?/.test(uri.split("@").pop() || "");
  if (!hasDbName) {
    console.warn("[DB] MONGODB_URI missing DB name — should be ...mongodb.net/userlogin?retryWrites=... (SRV) or .../userlogin?ssl=true&... (non-SRV)");
  }
  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`[DB] Connected to ${conn.connection.host} / ${conn.connection.name}`);
    return conn;
  } catch (err) {
    console.error("[DB] Connection failed:", err.message);
    if (err.message.includes("querySrv") || err.message.includes("ECONNREFUSED")) {
      console.error("[DB] → SRV DNS lookup blocked. On home Wi-Fi this is often Windows Firewall / ISP DNS filtering _mongodb._tcp SRV.");
      console.error("[DB]   Try: 1) nslookup -type=SRV _mongodb._tcp.cluster0.tjelkqj.mongodb.net 8.8.8.8");
      console.error("[DB]        2) Windows Firewall allow node.exe + set DNS to 8.8.8.8 / 1.1.1.1, ipconfig /flushdns");
      console.error("[DB]        3) Test on phone hotspot — if hotspot works, home DNS is blocking SRV");
      console.error("[DB]        4) Atlas → Connect → Drivers → copy NON-SRV mongodb:// 3-host URI as fallback (bypasses SRV)");
    } else if (err.message.toLowerCase().includes("auth") || err.message.includes("bad auth")) {
      console.error("[DB] Check password encoding (encodeURIComponent if @:/?#[]% in password) and DB user in Atlas → Database Access");
    } else {
      console.error("[DB] Check: 1) Atlas Network Access allows 0.0.0.0/0, 2) password encoding, 3) URI db name /userlogin");
    }
    return null;
  }
}

module.exports = connectDB;
