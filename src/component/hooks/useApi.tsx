import axios from "axios";
import { useReducer } from "react";


interface IClans {
    name: string;
    warFrequency: string;
    members: number;
    warWins: number;
    badgeUrls: { small: string };
    clanPoints: number;
}

interface IValues {
    typeFilter: string;
    valueText: string | number;
}

interface IInitialValues {
    dataApi: IClans[];
    error: { isError: boolean; message: string };
    loading: boolean;
}

const initialValues: IInitialValues = {
    dataApi: [],
    error: { isError: false, message: "" },
    loading: false,
};

type ActionType =
    | { type: "DATA_API"; payload: [] }
    | { type: "IS_ERROR"; payload: { error: boolean; message: string } }
    | { type: "IS_LOADING"; payload: boolean };

const reducerForm = (state: IInitialValues, action: ActionType) => {
    switch (action.type) {
        case "DATA_API":
            return {
                ...state,
                dataApi: action.payload,
                error: { isError: false, message: "" },
                loading: false,
            };

        case "IS_ERROR":
            return {
                ...state,
                dataApi: [],
                error: {
                    isError: action.payload.error,
                    message: action.payload.message,
                },
            };
        case "IS_LOADING":
            return {
                ...state,
                loading: action.payload,
            };
        default:
            return state;
    }
};

export default function useApi() {

    const [stateDataApi, dispatch] = useReducer(reducerForm, initialValues);

    const handleSearchApi = (values: IValues) => {
        dispatch({ type: "IS_LOADING", payload: true });

        axios({
            url: process.env.REACT_APP_URL_PROXY,
            method: "POST",
            data: {
                'typeFilter': values.typeFilter,
                'value': values.valueText
            },
        })
            .then((response) => {
                console.log(response);
                if (response?.data?.status === 400) {
                    dispatch({
                        type: "IS_ERROR",
                        payload: { error: true, message: "Invalid search parameter" },
                    });
                    dispatch({ type: "IS_LOADING", payload: false });
                } else if (response.status === 200) {
                    dispatch({ type: "DATA_API", payload: response.data.items });
                }
            })
            .catch((e) => {
                console.log(e.message);
                dispatch({
                    type: "IS_ERROR",
                    payload: { error: true, message: "Invalid search parameter" },
                });
            });
    };

    return {
        handleSearchApi,
        stateDataApi,
    }

}