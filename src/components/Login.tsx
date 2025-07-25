import { FC } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/AuthContext";

type Inputs = {
  username: string;
  password: string;
};

export const Login: FC = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    auth.signin(data.username, data.password, () => {
      navigate("/");
    });
  };

  return (
    <div className="col-12">
      <div className="card card-container">
        <img
          src="//ssl.gstatic.com/accounts/ui/avatar_2x.png"
          alt="profile-img"
          className="profile-img-card"
          style={{ width: "100px", height: "100px", margin: "auto" }}
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              className="form-control"
              {...register("username", { required: true })}
            />
          </div>
          {errors.username && (
            <div className="form-group">
              <div className="alert alert-danger" role="alert">
                {errors.username.message}
              </div>
            </div>
          )}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              className="form-control"
              {...register("password", { required: true })}
            />
            {errors.password && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {errors.password.message}
                </div>
              </div>
            )}
          </div>
          <div className="form-group">
            <button className="btn btn-primary btn-block" disabled={!isValid}>
              {isSubmitting && (
                <span className="spinner-border spinner-border-sm"></span>
              )}
              <span>Login</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
