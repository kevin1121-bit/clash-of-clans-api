
import { Formik } from "formik";
import Card from "../card/card";
import useApi from "../hooks/useApi";


interface IClans {
  name: string;
  warFrequency: string;
  members: number;
  warWins: number;
  badgeUrls: { small: string };
  clanPoints: number;
}



function HomePage() {
  const api = useApi();

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
          api.handleSearchApi(values);
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
        <h4>{api.stateDataApi.error.isError && api.stateDataApi.error.message}</h4>
      </div>
      <div>
        {api.stateDataApi.loading ? (
          <div className='text-center'>
            <div className='spinner-border' role='status'>
              <h4 className='visually-hidden'>Loading...</h4>
            </div>
          </div>
        ) : (
          <div className='row'>
            {api.stateDataApi.dataApi &&
              api.stateDataApi.dataApi.length !== 0 &&
              api.stateDataApi.dataApi.map((value: IClans, index: any) => (
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
