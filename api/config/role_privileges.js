module.exports= {
    privGroups: [
        {
            id:"USERS",
            name:"User Permissions"
        },
        {
            id:"ROLES",
            name:"Role Permissions"
        },
        {
            id:"CATEGORIES",
            name:"Category Permissions"
        },
        {
            id:"AUDITLOGS",
            name:"Auiditlogs Permissions"
        }
    ],

    privileges :[
        // user crud işlmeleri için
        {
            key: "user_view",
            name: "User view",
            group: "USERS",
            description: "User view"
        },
        {
            key: "user_add",
            name: "User add",
            group: "USERS",
            description: "User add"
        },
        {
            key: "user_update",
            name: "User update",
            group: "USERS",
            description: "User update"
        },
        {
            key: "user_delete",
            name: "User delete",
            group: "USERS",
            description: "User delete"
        },

        // role crud işlemleri için
        {
            key: "role_view",
            name: "Role view",
            group: "ROLES",
            description: "Role view"
        },
        {
            key: "role_add",
            name: "Role add",
            group: "ROLES",
            description: "Role add"
        },
        {
            key: "role_update",
            name: "Role update",
            group: "ROLES",
            description: "Role update"
        },
        {
            key: "role_delete",
            name: "Role delete",
            group: "ROLES",
            description: "Role delete"
        },

        // category crud işlemleri için
        {
            key: "category_view",
            name: "Category view",
            group: "CATEGORIES",
            description: "Category view"
        },
        {
            key: "category_add",
            name: "Category add",
            group: "CATEGORIES",
            description: "Category add"
        },
        {
            key: "category_update",
            name: "Category update",
            group: "CATEGORIES",
            description: "Category update"
        },
        {
            key: "category_delete",
            name: "Category delete",
            group: "CATEGORIES",
            description: "Category delete"
        },

        //auditlogs için
        {
            key: "auditlogs_view",
            name: "Auditlogs view",
            group: "AUDITLOGS",
            description: "Auditlogs view"
        },
    ]
}