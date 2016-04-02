process swimlane_test{
	action single{
		agent { Alice}
		requires { resource_a }
	}
	action single_two{
		agent { Bob }
		provides { resource_b}
	}
	action shared {
		agent { Alice && Bob }
	}
}
