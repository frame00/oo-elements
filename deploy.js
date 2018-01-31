const [, ,
	S3_PATH, // e.g. Bucket/Dir/Src/
	S3_IAM_KEY,
	S3_IAM_SECRET
] = process.argv

if (!S3_PATH || !S3_IAM_KEY || !S3_IAM_SECRET) {
	return
}

const gulp = require('gulp')
const s3 = require('gulp-s3-upload')({
	accessKeyId: S3_IAM_KEY,
	secretAccessKey: S3_IAM_SECRET
})

const [Bucket] = S3_PATH.split('/')
const keyPrefix = S3_PATH.replace(`${Bucket}/`, '')

const config = {
	Bucket,
	keyTransform(filename) {
		return `${keyPrefix}${filename}`
	}
}

gulp.src('dist/**').pipe(s3(config))
