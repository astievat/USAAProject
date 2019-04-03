using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace accountmanager
{
	public class Review
	{
		//this is just a container for all info related
		//to an account.  We'll simply create public class-level
		//variables representing each piece of information!
		public int id;
		public string review;
		public string sentimentScore;
		public string subjectivity;
		public string actionableScore;
		public string positiveCount;
        public string negativeCount;
        public string actionableCount;
        public string wordCount;
        public string qType;
    }
}