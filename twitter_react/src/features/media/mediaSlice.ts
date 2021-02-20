import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import axios from "axios";
import { POST_IMAGE, PROPS_POST_IMAGE, PROPS_IMAGES } from "../types";

const apiUrl = process.env.REACT_APP_DEV_API_URL;

export const fetchAsyncGetPostedImage = createAsyncThunk(
    "media/getPostedImage",
    async () => {
        const res = await axios.get(`${apiUrl}media_api/post/`, {
            headers: {
                Authorization: `JWT ${localStorage.localJWT}`,
            },
        });
        return res.data;
    }
);

export const fetchAsyncGetImages = createAsyncThunk(
    "media/getImages",
    async () => {
        const res = await axios.get(`${apiUrl}media_api/imageslist/`, {
            headers: {
                Authorization: `JWT ${localStorage.localJWT}`,
            },
        });
        return res.data;
    }
)
export const fetchAsyncPostImage = createAsyncThunk(
    "media/postImage",
    async (scrName: POST_IMAGE) => {
        const res = await axios.post(`${apiUrl}media_api/post/`, scrName, {
            headers: {
                Authorization: `JWT ${localStorage.localJWT}`,
            },
        });
        return res.data;
    }
);

export const fetchAsyncPostImages = createAsyncThunk(
    "media/Images",
    async (scrName: POST_IMAGE) => {
        // const uploadData = new FormData();
        // uploadData.append("scrName", scrName.scrName);
        const res = await axios.post(`${apiUrl}media_api/images/`, scrName, {
            headers: {
                Authorization: `JWT ${localStorage.localJWT}`,
            },
        });
        return res.data;
    }
);

export const fetcyAsyncDeletePostedImage = createAsyncThunk(
    "media/postedImage/delete",
    async (post_image: PROPS_POST_IMAGE) => {
        const res = await axios.delete(
            `${apiUrl}media_api/post/${post_image.id}/`, {
                headers: {
                    Authorization: `JWT ${localStorage.localJWT}`
                }
            }
        );
        return post_image.id;
        
    }
);

export const fetcyAsyncDeleteImages = createAsyncThunk(
    "media/Images/delete",
    async (images: PROPS_IMAGES) => {
        const res = await axios.delete(
            `${apiUrl}media_api/imageslist/${images.id}/`, {
                headers: {
                    Authorization: `JWT ${localStorage.localJWT}`
                }
            }
        );
        return images;
    }
);

export const mediaSlice = createSlice({
    name: "media",
    initialState: {
        isLoadingPostImage: false,

        post_image: [
            {
               id: 0,
               scrName: "",
               userPost: 0,
               created_on: "" 
            },
        ],
        images: [
            {
                id: 0,
                userImg: 0,
                imgs: "",
                imgPost: 0,
            }
        ] 
    },
    reducers: {
        fetchPostImageStart(state) {
            state.isLoadingPostImage = true;
        },
        fetchPostImageEnd(state) {
            state.isLoadingPostImage = false;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchAsyncGetPostedImage.fulfilled, (state, action) => {
            return {
                ...state,
                post_image: action.payload
            }
        });
        builder.addCase(fetchAsyncGetImages.fulfilled, (state, action) => {
        return {
            ...state,
            images: action.payload
            }
        });
        builder.addCase(fetchAsyncPostImage.fulfilled, (state, action) => {
            return {
                ...state,
                post_image: [...state.post_image, action.payload],
            }
        });

        // builder.addCase(fetchAsyncPostImages.fulfilled, (state, action) => {
        //     return {
        //         ...state,
        //         images: [...state.images, action.payload]
        //     }
        // });
        builder.addCase(fetcyAsyncDeletePostedImage.fulfilled, (state, action) => {
            return {
                ...state,
                post_image: state.post_image.filter((p_image) => 
                    p_image.id !== action.payload
                    
                )
                
            }
            
        });
        builder.addCase(fetcyAsyncDeleteImages.fulfilled, (state, action) => {
            
            return {
                ...state,
                images: state.images.filter((image) => 
                    image.id !== action.payload.id
                )
            }
        });
    },
});

export const {
    fetchPostImageStart,
    fetchPostImageEnd
} = mediaSlice.actions;

export const selectIsLoadingPostImage = (state: RootState) => state.media.isLoadingPostImage;
export const selectPostImage = (state: RootState) => state.media.post_image;
export const selectImages = (state: RootState) => state.media.images;

export default mediaSlice.reducer;
