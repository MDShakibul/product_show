
					<nav className="hidden sm:flex items-center gap-3 text-sm">
						<Link
							href="/products"
							className={path === '/products' ? 'underline' : ''}
						>
							All
						</Link>
						<Link
							href="/products/new"
							className={path?.endsWith('/new') ? 'underline' : ''}
						>
							Create
						</Link>
					</nav>
				</div>
				<div className="flex items-center 