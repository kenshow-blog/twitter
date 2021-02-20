export interface LOGIN {
    email: string;
    password: string;
}

export interface REGISTER {
    username: string;
    email: string;
    password: string;
}

export interface POST_IMAGE {
    scrName: string;
}


// 個人のユーザーページに行く際に、そのデータを向こう側に渡すため
export interface PROPS_POST_IMAGE {
    id: number;
    scrName: string;
    userPost: number;
    created_on: string;
}

export interface PROPS_IMAGES {
    id: number;
    userImg: number;
    imgs: string;
    imgPost: number;
}

