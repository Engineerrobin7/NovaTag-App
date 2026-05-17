import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

/**
 * Endpoint to receive encrypted location reports from the network.
 * Validates the payload and stores it in Firestore.
 */
export const reportLocation = functions.https.onRequest(async (req, res) => {
  // Only allow POST requests
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  const { publicKeyHash, encryptedData } = req.body;

  // Basic validation
  if (!publicKeyHash || !encryptedData) {
    res.status(400).send("Bad Request: Missing required fields");
    return;
  }

  const { nonce, ephemeralPublicKey, box } = encryptedData;
  if (!nonce || !ephemeralPublicKey || !box) {
    res.status(400).send("Bad Request: Missing encrypted data fields");
    return;
  }

  try {
    // Add to Firestore
    await db.collection("location_reports").add({
      publicKeyHash,
      encryptedData: {
        nonce,
        ephemeralPublicKey,
        box,
      },
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(200).send("Report accepted");
  } catch (error) {
    console.error("Error adding report:", error);
    res.status(500).send("Internal Server Error");
  }
});
