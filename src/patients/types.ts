type userName = {
    title: string,
    first: string,
    last: string
}

type userDob = {
    date: string,
    age: number
}

type userId = {
    name: string,
    value: any
}

type userPicture = {
    large: string,
    medium: string,
    thumbnail: string
}

type userApi = {
    gender: string,
    name: userName,
    dob: userDob,
    id: userId,
    picture: userPicture
}

export type apiUserResponse = {
    results: userApi[],
    info: {
        seed: string,
        results: number,
        page: number,
        version: string
    }
}

export const patientsType = {
    CHILD: 'child',
    YOUNG: 'young',
    ELDER: 'elder'
}