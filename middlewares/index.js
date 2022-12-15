import User from "../model/user";


export const isInstructor = async (req, res, next) => {
    const user = await User.findById(req.user._id).exec();
    if (!user.role.includes('Instructor')) return res.sendStatus(403);
    next();
}