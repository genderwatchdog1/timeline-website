import os
import re
import sys
import requests
from bs4 import BeautifulSoup

# List of HTML files to check
HTML_FILES = [
    'index.html',
    'timeline_ko.html',
    'timeline_ja.html',
    'timeline_zh_cn.html',
    'timeline_zh_tw.html',
]

# Regex for blog links
BLOG_LINK_RE = re.compile(r'https://blog\.genderwatchdog\.org/[^\s"\']+')


def check_html_file(filepath):
    print(f'Checking {filepath}...')
    try:
        with open(filepath, encoding='utf-8') as f:
            html = f.read()
    except Exception as e:
        print(f'  ERROR: Could not read {filepath}: {e}')
        return False, []
    try:
        soup = BeautifulSoup(html, 'html.parser')
    except Exception as e:
        print(f'  ERROR: Could not parse {filepath}: {e}')
        return False, []
    # Find all <a> tags in tooltips
    links = []
    for tooltip in soup.select('.timeline-tooltip'):
        for a in tooltip.find_all('a', href=True):
            href = a['href']
            if BLOG_LINK_RE.match(href):
                links.append(href)
    print(f'  Found {len(links)} blog links in tooltips.')
    return True, links


def check_link(url):
    try:
        resp = requests.head(url, allow_redirects=True, timeout=10)
        if resp.status_code == 200:
            return True
        else:
            print(f'    BAD LINK: {url} (status {resp.status_code})')
            return False
    except Exception as e:
        print(f'    ERROR: Could not reach {url}: {e}')
        return False


def main():
    # Check if a specific file was provided as a command-line argument
    files_to_check = []
    if len(sys.argv) > 1:
        file_param = sys.argv[1]
        if os.path.exists(file_param):
            files_to_check = [file_param]
        else:
            print(f"Error: File '{file_param}' not found.")
            return
    else:
        files_to_check = HTML_FILES
    
    all_passed = True
    for html_file in files_to_check:
        if not os.path.exists(html_file):
            print(f'File not found: {html_file}')
            all_passed = False
            continue
        ok, links = check_html_file(html_file)
        if not ok:
            all_passed = False
            continue
        for link in links:
            if not check_link(link):
                all_passed = False
    
    if all_passed:
        if len(files_to_check) == 1:
            print(f'\nAll blog links in {files_to_check[0]} are valid!')
        else:
            print('\nAll HTML files loaded and all blog links are valid!')
    else:
        print('\nSome errors or broken links found. See above for details.')


if __name__ == '__main__':
    main() 