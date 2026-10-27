import rcu,_thread,math,cmath
P = 0

def task1():
	P = 0
	while True:
		if rcu.GetTouch(1):
			P = 1
		if rcu.GetTouch(2):
			P = 2
		if (P) == 1:
			rcu.SetMotor(1,-50)
			rcu.SetMotor(2,-50)
			rcu.SetWaitForTime(1)
			rcu.SetMotor(1,-50)
			rcu.SetMotor(2,50)
			rcu.SetWaitForTime(0.5)
		if (P) == 2:
			rcu.SetMotor(1,-50)
			rcu.SetMotor(2,-50)
			rcu.SetWaitForTime(1)
			rcu.SetMotor(1,50)
			rcu.SetMotor(2,-50)
			rcu.SetWaitForTime(0.5)
		rcu.SetMotor(1,50)
		rcu.SetMotor(2,50)

task1()
