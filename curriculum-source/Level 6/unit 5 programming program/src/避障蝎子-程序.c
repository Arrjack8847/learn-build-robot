#define _TASK_1_ 1

#include "JMLib.c"
#include <GetTouch.h>
#include <SetMotor.h>
#include <SetWaitForTime.h>

volatile double GV_44c29edb103a2872f519ad0c9a0fdaaa = 0;

void task1(void)
{
	GV_44c29edb103a2872f519ad0c9a0fdaaa = 0;
	for (;;) {
		if (GetTouch(1)) {
			GV_44c29edb103a2872f519ad0c9a0fdaaa = 1;
			
		}
		
		if (GetTouch(2)) {
			GV_44c29edb103a2872f519ad0c9a0fdaaa = 2;
			
		}
		
		if ((GV_44c29edb103a2872f519ad0c9a0fdaaa)==(1)) {
			SetMotor(1,-50);
			
			SetMotor(2,-50);
			
			SetWaitForTime(1);
			
			SetMotor(1,-50);
			
			SetMotor(2,50);
			
			SetWaitForTime(0.5);
			
		}
		
		if ((GV_44c29edb103a2872f519ad0c9a0fdaaa)==(2)) {
			SetMotor(1,-50);
			
			SetMotor(2,-50);
			
			SetWaitForTime(1);
			
			SetMotor(1,50);
			
			SetMotor(2,-50);
			
			SetWaitForTime(0.5);
			
		}
		
		SetMotor(1,50);
		
		SetMotor(2,50);
		
	}
	
}