const UserModel = require('../models/UserModel');

async function ranking(request, response) {
    try {
        const token = request.cookies.token || "";

        if (token === "") {
            return response.status(401).json({
                message: "Please login first",
                error: true,
            });
        }

        const { sortby } = request.body;

        let sortCriteria;
        if (sortby === "upvotes") {
            sortCriteria = { upvotes: -1 }; 
        } else if (sortby === "followers") {
            sortCriteria = { followers: -1 }; 
        } else {
            return response.status(400).json({
                message: "Invalid sort criteria",
                error: true,
            });
        }

        const users = await UserModel.find({}).sort(sortCriteria).select('-password');
        response.status(200).json({
            message: `Ranking fetched successfully by ${sortby}`,
            data: users,
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true,
        });
    }
}

module.exports = ranking;
