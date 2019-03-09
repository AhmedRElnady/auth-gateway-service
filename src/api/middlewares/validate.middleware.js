// ToDo: implement
function validate() {
    return (req, res, next) => {
        (async ()=> {
            console.log(">>> its VALID msg from validat middleware");
            next()
        })()
    }
}

module.exports = validate;