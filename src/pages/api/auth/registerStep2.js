import connectionPool from "../../../utils/db";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
     
      const [
        hobbiesResult,
        genderResult,
        meetingInterestResult,
        racialIdentityResult,
        locationResult,
        cityResult,
      ] = await Promise.all([
        connectionPool.query("SELECT hobbies_id, hobby_name FROM hobbies"),
        connectionPool.query("SELECT gender_id, gender_name FROM gender"),
        connectionPool.query(
          "SELECT meeting_interest_id, meeting_name FROM meeting_interest",
        ),
        connectionPool.query(
          "SELECT racial_id, racial_name FROM racial_identity",
        ),
        connectionPool.query("SELECT location_id, location_name FROM location"),
        connectionPool.query(
          "SELECT city_id, city_name, location_id FROM city",
        ),
      ]);

  
      res.status(200).json({
        hobbies: hobbiesResult, 
        genders: genderResult,
        meeting_interest: meetingInterestResult,
        racial_identity: racialIdentityResult,
        location: locationResult.rows, 
        city: cityResult.rows, 
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
