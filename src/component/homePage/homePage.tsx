import axios from "axios";
import { useReducer } from "react";
import { Formik } from "formik";
import Card from "../card/card";

interface IValues {
  typeFilter: string;
  valueText: string | number;
}

interface IClans {
  name: string;
  warFrequency: string;
  members: number;
  warWins: number;
  badgeUrls: { small: string };
  clanPoints: number;
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

function HomePage() {
  const [stateDataApi, dispatch] = useReducer(reducerForm, initialValues);

  const handleSearchApi = (values: IValues) => {
    dispatch({ type: "IS_LOADING", payload: true });
    axios({
      url: process.env.REACT_APP_URL_PROXY,
      method: "GET",
      params: {
        typeFilter: values.typeFilter,
        value: values.valueText,
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

  return (
    <div className='container'>
      <Formik
        initialValues={{ typeFilter: "", valueText: "" }}
        validate={(values) => {
          const errors: any = {};
          if (!values.typeFilter) {
            errors.typeFilter = "Filter is required";
          }
          if (!values.valueText) {
            errors.valueText = "Search is required";
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          handleSearchApi(values);
          setSubmitting(false);
        }}>
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <div className='text-center'>
              <div className='input-group mt-3'>
                <select
                  className='form-select'
                  aria-label='Default select example'
                  name='typeFilter'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.typeFilter}>
                  <option value=''>Filter by</option>
                  <option value='name'>Name</option>
                  <option value='minClanPoints'>minimum points</option>
                  <option value='warFrequency'>war frequency</option>
                </select>
                <input
                  type={
                    values.typeFilter === "minClanPoints" ? "number" : "text"
                  }
                  name='valueText'
                  className='form-control'
                  placeholder='Search'
                  aria-label='Search'
                  aria-describedby='button-addon2'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.valueText}
                />
                <button
                  className='btn btn-outline-secondary'
                  id='button-addon2'
                  type='submit'
                  disabled={isSubmitting}>
                  Search
                </button>
              </div>
            </div>
            <br />
            <p>
              {errors.typeFilter && touched.typeFilter ? errors.typeFilter : ""}

              {touched.valueText && errors.valueText ? errors.valueText : ""}
            </p>
          </form>
        )}
      </Formik>
      <div className='text-center'>
        <h4>{stateDataApi.error.isError && stateDataApi.error.message}</h4>
      </div>
      <div>
        {stateDataApi.loading ? (
          <div className='text-center'>
            <div className='spinner-border' role='status'>
              <h4 className='visually-hidden'>Loading...</h4>
            </div>
          </div>
        ) : (
          <div className='row'>
            {stateDataApi.dataApi &&
              stateDataApi.dataApi.length !== 0 &&
              stateDataApi.dataApi.map((value: IClans, index: any) => (
                <div className='col-md-3' key={index.toString()}>
                  <div className='card-group'>
                    <Card
                      clanPoints={value.clanPoints}
                      name={value.name}
                      image={value.badgeUrls.small}
                      members={value.members}
                      warFrequency={value.warFrequency}
                      warWins={value.warWins}
                    />
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
