export default function TopNav() {
	return (
		<>
			<nav className='navbar navbar-expand-lg navbar-dark bg-dark'>
				<a
					className='navbar-brand'
					href='/'
				>
					Workout App
				</a>
				<button
					className='navbar-toggler'
					type='button'
					data-toggle='collapse'
					data-target='#navbarSupportedContent'
					aria-controls='navbarSupportedContent'
					aria-expanded='false'
					aria-label='Toggle navigation'
				>
					<span className='navbar-toggler-icon'></span>
				</button>

				<div
					className='collapse navbar-collapse'
					id='navbarSupportedContent'
				>
					<ul className='navbar-nav mr-auto'>
						<li className='nav-item'>
							<a
								className='nav-link'
								href='/exercises'
							>
								Exercises
							</a>
						</li>
						<li className='nav-item'>
							<a
								className='nav-link'
								href='/workouts'
							>
								Workouts
							</a>
						</li>
					</ul>
				</div>
			</nav>
		</>
	);
}