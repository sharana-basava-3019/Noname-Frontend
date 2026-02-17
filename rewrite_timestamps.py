#!/usr/bin/env python3
import random
from datetime import datetime, timedelta, time

# --- Configuration ---
# The script processes commits from newest to oldest.
# Set the timestamp for the most recent commit.
# Each older commit will be set to a random time before the previous one.

# Start time for the most recent commit (today)
# Format: (Hour, Minute)
START_TIME_TODAY = (12, 50)

# Time range for commits on previous days
# The script will pick a random time within this range for older commits.
# Format: (Hour, Minute)
DAY_START_TIME = (9, 0)
DAY_END_TIME = (23, 0)

# Random time gap to subtract for each subsequent older commit (in minutes)
MIN_GAP_MINUTES = 5
MAX_GAP_MINUTES = 45
# --- End Configuration ---

# Global variable to hold the timestamp of the previously processed commit
# This ensures that each commit is chronologically older than the one before it.
previous_commit_time = None

def get_random_time_on_date(commit_date):
    """Generates a random time within the configured daily range for a given date."""
    start_time = time(DAY_START_TIME[0], DAY_START_TIME[1])
    end_time = time(DAY_END_TIME[0], DAY_END_TIME[1])
    
    start_datetime = datetime.combine(commit_date, start_time)
    end_datetime = datetime.combine(commit_date, end_time)
    
    time_diff_seconds = int((end_datetime - start_datetime).total_seconds())
    random_seconds = random.randint(0, time_diff_seconds)
    
    return start_datetime + timedelta(seconds=random_seconds)

def adjust_commit_timestamp(commit):
    """
    This is the callback function executed by git-filter-repo for each commit.
    It adjusts the author and committer dates based on the defined rules.
    """
    global previous_commit_time
    
    today = datetime.now().date()
    
    if previous_commit_time is None:
        # This is the most recent commit. Set its time to today's start time.
        now = datetime.now()
        new_time = now.replace(hour=START_TIME_TODAY[0], minute=START_TIME_TODAY[1], second=random.randint(0, 59), microsecond=0)
    else:
        # This is an older commit.
        # Check if the commit's original date is the same as the previous one.
        original_commit_date = datetime.fromtimestamp(commit.committer_date).date()
        previous_commit_processed_date = previous_commit_time.date()

        if original_commit_date == previous_commit_processed_date:
            # Same day: subtract a random gap from the previous commit's time.
            gap = timedelta(minutes=random.randint(MIN_GAP_MINUTES, MAX_GAP_MINUTES))
            new_time = previous_commit_time - gap
        else:
            # New day (older): generate a random time for this commit's original date.
            # Ensure it's not later than the previous commit's time.
            new_time = get_random_time_on_date(original_commit_date)
            if new_time >= previous_commit_time:
                # If the random time is accidentally later, just subtract a gap.
                new_time = previous_commit_time - timedelta(minutes=random.randint(MIN_GAP_MINUTES, MAX_GAP_MINUTES))

    # Update the global variable for the next iteration
    previous_commit_time = new_time
    
    # Convert the new datetime object to a Git-compatible timestamp string
    # Format: "1675432198 -0500" (Unix timestamp + timezone offset)
    new_timestamp = new_time.strftime('%s %z').encode()

    # Update both author and committer dates
    commit.author_date = new_timestamp
    commit.committer_date = new_timestamp

# This part is not executed when called by git-filter-repo,
# but it's useful for understanding the script's purpose.
if __name__ == "__main__":
    print("This script is designed to be used with `git-filter-repo`.")
    print("It rewrites commit timestamps to appear more natural and chronological.")
    print("\nUsage:")
    print("1. Make a backup of your repository.")
    print("2. Run the following command in your terminal:")
    print("   git filter-repo --commit-callback 'return globals().get(\"adjust_commit_timestamp\")(commit)' --force")
    print("\nSee the script's comments for configuration options.")
