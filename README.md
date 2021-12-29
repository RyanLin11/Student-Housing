# Housing For You
![Front Page](https://i.postimg.cc/nc0twCVp/screenshot.png)

## Inspiration
Many university students want to live off-campus in their upper years. The accommodations are nicer, close to campus, and in many cases, cheaper than on-campus housing. However, prospective tenants have to sign a one-year lease, even though the average Waterloo co-op student will only live there for four or eight months. Now, they are faced with the struggle to find students to fill their spots. At the same time, other students have trouble finding the right people to lease from. That is where Housing For You comes in to help.

## What It Does
A website that helps university students put their accommodations up for rent and find housing for their study terms. Every rental listing is complete with price information, photos, and a list of amenities to allow the student to find housing that suites their unique needs.

## Technologies Used
- Express and Node.js was used for the backend
- Pug template engine was used to render views
- Form validation was done with [express-validator](https://express-validator.github.io/docs/)
- User authentication was done with [bcrypt](https://www.npmjs.com/package/bcrypt)
- Sessions was managed with [express-sessions](https://www.npmjs.com/package/express-session)
- User info and listings was stored in MongoDB with [Mongoose](https://mongoosejs.com/)
- Listing information and images were retrieved using [Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview)
- Image hosting was provided by [AWS S3](https://aws.amazon.com/s3/)

## Website Link
[https://studenthousinguw.herokuapp.com](https://studenthousinguw.herokuapp.com)
