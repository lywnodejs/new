export default function Panel(props) {
  return (
    <div className="manage-dashboard__statistics">
      <div className="manage-dashboard__statistics__header">
        <span className="manage-dashboard__statistics__title">{props.title}</span>
        {props.subTitle}
      </div>
      <div className="manage-dashboard__statistics__content">
        {props.children}
      </div>
    </div>
  )
}
