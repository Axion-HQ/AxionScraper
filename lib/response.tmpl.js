const sendStatus = (response, statusCode, message) => {
    const statusParams = {
        400: "400 BAD REQUEST.",
        404: "404 NOT FOUND.",
        600: "600 INTERNAL SERVER ERROR.",
        200: "200 REQUEST OK.",
    }

    response.status(statusCode).send({
        response: statusParams[statusCode],
        status: statusCode,
        message: message
    })
};

export {
    sendStatus
}