#!/bin/bash

# Minimal Helper Utilities

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Print functions
print_info() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Validation
validate_project_name() {
  local name="$1"
  [[ -n "$name" && "$name" =~ ^[a-zA-Z0-9_-]+$ ]]
}

validate_username() {
  local username="$1"
  [[ -n "$username" && "$username" =~ ^[a-zA-Z0-9_-]+$ ]]
}

# File operations
create_dir() {
  mkdir -p "$1"
  print_success "Created directory: $1"
}

create_file() {
  local file="$1"
  local content="$2"
  local dir=$(dirname "$file")
  
  mkdir -p "$dir"
  echo "$content" > "$file"
  print_success "Created file: $file"
} 