default:
	cd model_generation && cargo run > ../test.html
	cd websocket-server && cargo run
