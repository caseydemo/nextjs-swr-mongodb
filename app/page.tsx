import Image from "next/image";
import styles from "./page.module.css";
import ExerciseList from "./components/ExerciseList";

export default function Home() {
	
    // get the exercises from the api
    
    
    return (
		<main className={styles.main}>
			<h1 className={styles.title}>Welcome to the Exercise App</h1>
			<p className={styles.description}>
				This is a simple exercise app built with Next.js and MongoDB.
			</p>
			<ExerciseList />
		</main>
	);
}
