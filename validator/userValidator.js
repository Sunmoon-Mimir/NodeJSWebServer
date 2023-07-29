const userSchema = {
    type: 'object',
    properties: {
        username: {
            type: "string",
            pattern: '^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*$',
            maxLength: 255,
            minLength: 3,
        },
        password: {
            type: "string",
            pattern:'^[a-zA-Z0-9]{6,16}$',
            maxLength: 16,
            minLength: 6,
        },
        gender: {
            type: "string",
            pattern: `[1,2]`,
            maxLength: 1,
            minLength: 1,
        }
    },
    required: ['username', 'password'],
}

module.exports =userSchema;