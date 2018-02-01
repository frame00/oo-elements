const [, ,
	S3_PATH, // e.g. Bucket/Dir/Src/
	S3_IAM_KEY,
	S3_IAM_SECRET,
	HOST,
	HOST_STAGE,
	S3_CACHE_CONTROL_MAX_AGE = 86400,
] = process.argv

if (!S3_PATH || !S3_IAM_KEY || !S3_IAM_SECRET) {
	return
}

const gulp = require('gulp')
const s3 = require('gulp-s3-upload')({
	accessKeyId: S3_IAM_KEY,
	secretAccessKey: S3_IAM_SECRET
})
const replace = require('gulp-string-replace')

const [Bucket] = S3_PATH.split('/')
const keyPrefix = S3_PATH.replace(`${Bucket}/`, '')

const config = {
	Bucket,
	CacheControl: `max-age=${S3_CACHE_CONTROL_MAX_AGE}`,
	keyTransform(filename) {
		return `${keyPrefix}${filename}`
	}
}

gulp.src('dist/**')
.pipe(replace(new RegExp('./dist/assets/', 'g'), `${HOST}/${HOST_STAGE}/assets/`))
.pipe(s3(config))
