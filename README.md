Flood It
========

In _Flood It_, you are given a grid of squares of various colours. Your objective is to fill the entire grid with the same colour.
To do this, you are allowed to change the colour of the top left square and all other squares connected to it every turn.
Two squares are connected if they are adjacent and of the same colour.
If you choose the right colours, you will eventually fill the entire grid with the same colour.

In this implementation, the computer will find a solution using a greedy algorithm, choosing the colour that will connect the most squares.
This will not result in the optimal solution since this problem is NP-Hard.
The player's goal is to find a better solution than the computer (or a solution that's just as good), which is possible 
because the computer will most likely not find the optimal solution.

The game is written in jQuery/Javascript and makes use of Twitter bootstrap to make it look nice.

Enjoy!


