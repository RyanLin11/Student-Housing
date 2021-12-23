const mongoose = require('mongoose');

const AWS = require('aws-sdk');

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_ACCESS_SECRET,
});

const s3 = new AWS.S3({params: {Bucket: process.env.AWS_BUCKET_NAME}});

const PhotoSchema = new mongoose.Schema({
    photo_url: {
        type: String,
        required: true,
    },
    photo_key: {
        type: String,
        required: true,
    },
});

PhotoSchema.pre('deleteOne', {document:true, query: false}, function(next) {
    s3.deleteObject({
        Bucket: 'studenthousinguw',
        Key: this.photo_key,
    }, (err, data) => {
        console.log(data);
        if(err) {
            next(new Error(err));
        } else {
            next();
        }
    });
});

PhotoSchema.statics.createWithData = async function(file) {
    const upload = new AWS.S3.ManagedUpload({
        params: {
          Body: file.data,
          Key: file.name,
          ACL: 'public-read',
        },
        service: s3,
    });
    const response = await upload.promise();
    const photo = new this({photo_url: response.Location, photo_key: response.Key});
    await photo.save();
    return photo;
};

const Photo = new mongoose.model("Photo", PhotoSchema);

module.exports = Photo;