export const toUserResponse = (user) => {
    return {
        username: user.username,
        email: user.email,
    };
};
