const sanitizeUser = (user)=> {
    return {
        id:user.id,
        name: user.name,
        email:user.email,
        phone_number:user.phphone_numberone,
        isVerified:user.isVerified
    };
}

export default sanitizeUser;