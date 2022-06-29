export default function ApplyForStaffPage() {
  return (
    <div className="columns is-centered">
      <div className="column box">
        <h1 className="title is-2">Create Staff Application</h1>

        <form action="" className="form">
          <div className="field is-horizontal">
            <div className="field-label is-normal">
              <label className="label">Birthday:</label>
            </div>
            <div className="field-body">
              <div className="field">
                <p className="control">
                  <input
                    className="input"
                    type="date"
                    name="birthday"
                    value={userEdit?.birthday}
                    onChange={handleChange}
                  />
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
