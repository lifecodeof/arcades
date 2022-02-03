const { parallel, dest, src } = require('gulp')

const copyArtifacts = () => src("apps/contracts/artifacts/**/*")
    .pipe(dest("apps/server/artifacts"))
    .pipe(dest("apps/web/src/artifacts"))

const copyTypechain = () => src("apps/contracts/typechain/**/*")
    .pipe(dest("apps/server/typechain"))
    .pipe(dest("apps/web/src/typechain"))

const copyShared = () => src("shared/*")
    .pipe(dest("apps/server/src"))
    .pipe(dest("apps/web/src"))

const defaultTask = parallel(copyArtifacts, copyTypechain, copyShared)

exports.default = defaultTask
