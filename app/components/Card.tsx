import styles from "./styles/card.module.css";
export default function Card(props: any) {
    const {title, extraClasses, children} = props;

    const classes = extraClasses ? extraClasses : '';
	return (
		<div className={`${styles.card} ${classes}`} >
			<div className="card-body">
				<h2 className={styles.card_title}>{title}</h2>
				<div className="card-text">
					{children}
				</div>
			</div>
		</div>
	);
}