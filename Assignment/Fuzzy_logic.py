import numpy as np
import matplotlib.pyplot as plt


# Remove the problematic import
# from mpl_toolkits.mplot3d import Axes3D

# ------ Question 1: Implement different membership functions ------
def triangular_mf(x, a, b, c):
    """
    Triangular membership function
    x: input value
    a, b, c: parameters where a < b < c
    """
    return np.maximum(0, np.minimum((x - a) / (b - a), (c - x) / (c - b)))


def trapezoidal_mf(x, a, b, c, d):
    """
    Trapezoidal membership function
    x: input value
    a, b, c, d: parameters where a < b < c < d
    """
    return np.maximum(0, np.minimum(np.minimum((x - a) / (b - a), 1), (d - x) / (d - c)))


def gaussian_mf(x, mean, sigma):
    """
    Gaussian membership function
    x: input value
    mean: center of the gaussian
    sigma: width of the gaussian
    """
    return np.exp(-((x - mean) ** 2) / (2 * sigma ** 2))


def bell_mf(x, a, b, c):
    """
    Generalized Bell-shaped membership function
    x: input value
    a: width of the curve
    b: slope control
    c: center of the curve
    """
    return 1 / (1 + np.abs((x - c) / a) ** (2 * b))


def sigmoid_mf(x, a, c):
    """
    Sigmoid membership function
    x: input value
    a: slope control (a > 0 for increasing, a < 0 for decreasing)
    c: inflection point
    """
    return 1 / (1 + np.exp(-a * (x - c)))


def question1():
    """Question 1: Plot all implemented membership functions"""
    print("\n===== Question 1: Membership Functions =====")
    x = np.linspace(-10, 10, 1000)

    plt.figure(figsize=(15, 10))

    # Triangular MF
    plt.subplot(321)
    plt.plot(x, triangular_mf(x, -5, 0, 5))
    plt.title('Triangular Membership Function')
    plt.grid(True)

    # Trapezoidal MF
    plt.subplot(322)
    plt.plot(x, trapezoidal_mf(x, -6, -2, 2, 6))
    plt.title('Trapezoidal Membership Function')
    plt.grid(True)

    # Gaussian MF
    plt.subplot(323)
    plt.plot(x, gaussian_mf(x, 0, 2))
    plt.title('Gaussian Membership Function')
    plt.grid(True)

    # Bell-shaped MF
    plt.subplot(324)
    plt.plot(x, bell_mf(x, 2, 3, 0))
    plt.title('Generalized Bell-shaped Membership Function')
    plt.grid(True)

    # Sigmoid MF
    plt.subplot(325)
    plt.plot(x, sigmoid_mf(x, 1, 0))
    plt.title('Sigmoid Membership Function')
    plt.grid(True)

    plt.tight_layout()
    plt.show()


# ------ Question 2: Alpha-cut of a fuzzy set ------
def alpha_cut(membership_values, alpha):
    """
    Compute alpha-cut of a fuzzy set
    membership_values: array of membership values
    alpha: alpha level (0 <= alpha <= 1)
    """
    return np.where(membership_values >= alpha, 1, 0)


def question2():
    """Question 2: Plot the alpha-cut of a fuzzy set"""
    print("\n===== Question 2: Alpha-cut of a Fuzzy Set =====")
    x = np.linspace(-10, 10, 1000)

    # Using Gaussian membership function
    gaussian_values = gaussian_mf(x, 0, 2)

    # Alpha value
    alpha = 0.5
    alpha_cut_values = alpha_cut(gaussian_values, alpha)

    plt.figure(figsize=(10, 6))
    plt.plot(x, gaussian_values, 'b-', label='Fuzzy Set')
    plt.plot(x, alpha_cut_values, 'r--', label=f'Alpha-cut (α={alpha})')
    plt.axhline(y=alpha, color='g', linestyle=':', label=f'Alpha={alpha}')
    plt.title('Alpha-cut of a Fuzzy Set')
    plt.legend()
    plt.grid(True)
    plt.show()


# ------ Question 3: Union and intersection of fuzzy sets ------
def fuzzy_union(set_a, set_b):
    """
    Compute the union of two fuzzy sets
    set_a: membership values of set A
    set_b: membership values of set B
    """
    return np.maximum(set_a, set_b)


def fuzzy_intersection(set_a, set_b):
    """
    Compute the intersection of two fuzzy sets
    set_a: membership values of set A
    set_b: membership values of set B
    """
    return np.minimum(set_a, set_b)


def question3():
    """Question 3: Plot the union and intersection of two fuzzy sets with triangular MF"""
    print("\n===== Question 3: Union and Intersection of Fuzzy Sets =====")
    x = np.linspace(-10, 10, 1000)

    # Define two triangular fuzzy sets
    set_a = triangular_mf(x, -6, -2, 2)
    set_b = triangular_mf(x, -2, 2, 6)

    # Compute union and intersection
    union_result = fuzzy_union(set_a, set_b)
    intersection_result = fuzzy_intersection(set_a, set_b)

    plt.figure(figsize=(10, 6))
    plt.plot(x, set_a, 'b-', label='Fuzzy Set A')
    plt.plot(x, set_b, 'g-', label='Fuzzy Set B')
    plt.plot(x, union_result, 'r--', label='Union (A ∪ B)')
    plt.plot(x, intersection_result, 'm--', label='Intersection (A ∩ B)')
    plt.title('Union and Intersection of Fuzzy Sets')
    plt.legend()
    plt.grid(True)
    plt.show()


# ------ Question 4: Construct a fuzzy relation matrix ------
def fuzzy_relation_matrix(fuzzy_set_a, fuzzy_set_b):
    """
    Construct a fuzzy relation matrix using Cartesian product with min operator
    fuzzy_set_a: dictionary of elements and their membership degrees
    fuzzy_set_b: dictionary of elements and their membership degrees
    """
    # Extract elements and membership values
    elements_a = list(fuzzy_set_a.keys())
    elements_b = list(fuzzy_set_b.keys())
    membership_a = list(fuzzy_set_a.values())
    membership_b = list(fuzzy_set_b.values())

    # Initialize the relation matrix
    relation_matrix = np.zeros((len(elements_a), len(elements_b)))

    # Fill the matrix using min operation
    for i in range(len(elements_a)):
        for j in range(len(elements_b)):
            relation_matrix[i, j] = min(membership_a[i], membership_b[j])

    return relation_matrix, elements_a, elements_b


def question4():
    """Question 4: Demonstrate the construction of a fuzzy relation matrix"""
    print("\n===== Question 4: Fuzzy Relation Matrix =====")
    # Given fuzzy sets
    A = {'x1': 0.2, 'x2': 0.5, 'x3': 0.8}
    B = {'y1': 0.3, 'y2': 0.6, 'y3': 0.9}

    # Construct relation matrix
    R, elements_a, elements_b = fuzzy_relation_matrix(A, B)

    # Display the matrix
    print("Fuzzy Relation Matrix R:")
    print(np.round(R, 2))
    print("\nElements of A:", elements_a)
    print("Elements of B:", elements_b)

    # Create a table representation
    print("\nFuzzy Relation Matrix R as a table:")
    print("   |", end="")
    for y in elements_b:
        print(f" {y} |", end="")
    print("\n" + "-" * (4 + 5 * len(elements_b)))

    for i, x in enumerate(elements_a):
        print(f" {x} |", end="")
        for j in range(len(elements_b)):
            print(f" {R[i, j]:.1f} |", end="")
        print()


# ------ Question 5: Max-min composition of fuzzy relations ------
def max_min_composition(relation_r, relation_s):
    """
    Compute max-min composition of two fuzzy relations
    relation_r: first fuzzy relation matrix
    relation_s: second fuzzy relation matrix
    """
    # Get dimensions
    n = relation_r.shape[0]  # rows in R
    m = relation_s.shape[1]  # columns in S
    p = relation_r.shape[1]  # columns in R = rows in S

    # Initialize the result matrix
    result = np.zeros((n, m))

    # Compute max-min composition
    for i in range(n):
        for k in range(m):
            min_values = [min(relation_r[i, j], relation_s[j, k]) for j in range(p)]
            result[i, k] = max(min_values)

    return result


def question5():
    """Question 5: Demonstrate max-min composition of two fuzzy relations"""
    print("\n===== Question 5: Max-Min Composition =====")
    # Given fuzzy relations
    R = np.array([
        [0.2, 0.5, 0.7],
        [0.3, 0.6, 0.8],
        [0.4, 0.7, 0.9]
    ])

    S = np.array([
        [0.3, 0.6, 0.9],
        [0.2, 0.5, 0.8],
        [0.1, 0.4, 0.7]
    ])

    # Compute composition
    T = max_min_composition(R, S)

    # Display results
    print("Fuzzy Relation R:")
    print(R)
    print("\nFuzzy Relation S:")
    print(S)
    print("\nMax-Min Composition T = R ◦ S:")
    print(np.round(T, 2))


# ------ Question 6: Check properties of a fuzzy relation ------
def is_reflexive(relation):
    """Check if a fuzzy relation is reflexive"""
    n = relation.shape[0]
    for i in range(n):
        if relation[i, i] != 1.0:
            return False
    return True


def is_symmetric(relation):
    """Check if a fuzzy relation is symmetric"""
    n = relation.shape[0]
    for i in range(n):
        for j in range(n):
            if relation[i, j] != relation[j, i]:
                return False
    return True


def is_transitive(relation):
    """Check if a fuzzy relation is transitive"""
    n = relation.shape[0]
    for i in range(n):
        for k in range(n):
            max_min = 0
            for j in range(n):
                max_min = max(max_min, min(relation[i, j], relation[j, k]))
            if relation[i, k] < max_min:
                return False
    return True


def question6():
    """Question 6: Check the properties of a given fuzzy relation"""
    print("\n===== Question 6: Properties of a Fuzzy Relation =====")
    # Given fuzzy relation
    R = np.array([
        [1.0, 0.6, 0.4],
        [0.6, 1.0, 0.5],
        [0.4, 0.5, 1.0]
    ])

    # Check properties
    reflexive = is_reflexive(R)
    symmetric = is_symmetric(R)
    transitive = is_transitive(R)

    # Display results
    print("Fuzzy Relation R:")
    print(R)
    print("\nProperties:")
    print(f"Reflexive: {reflexive}")
    print(f"Symmetric: {symmetric}")
    print(f"Transitive: {transitive}")


# ------ Question 7: Extension principle for fuzzy set mapping ------
def question7():
    """Question 7: Demonstrate the use of extension principle"""
    print("\n===== Question 7: Extension Principle =====")
    # Define the domains
    x_domain = np.linspace(-10, 10, 1000)
    y_domain = np.linspace(-10, 10, 1000)

    # Define the mapping function
    def mapping_func(x):
        if x > 0:
            return x ** 2 - 3
        else:
            return x

    # Define the membership function (Normal distribution with mean=0, sigma=0.9)
    def membership_func(x):
        return gaussian_mf(x, 0, 0.9)

    # Apply extension principle
    y_membership = np.zeros(len(y_domain))

    for x_idx, x in enumerate(x_domain):
        y = mapping_func(x)
        # Find the closest y in y_domain
        y_idx = np.abs(y_domain - y).argmin()
        y_membership[y_idx] = max(y_membership[y_idx], membership_func(x))

    # Plot the results
    plt.figure(figsize=(12, 6))

    plt.subplot(1, 2, 1)
    membership_values_x = [membership_func(x) for x in x_domain]
    plt.plot(x_domain, membership_values_x)
    plt.title('Original Fuzzy Set A')
    plt.xlabel('x')
    plt.ylabel('μA(x)')
    plt.grid(True)

    plt.subplot(1, 2, 2)
    plt.plot(y_domain, y_membership)
    plt.title('Mapped Fuzzy Set B using Extension Principle')
    plt.xlabel('y')
    plt.ylabel('μB(y)')
    plt.grid(True)

    plt.tight_layout()
    plt.show()


# Ensure proper backend for Python 3.12
def set_backend():
    """Configure matplotlib for Python 3.12 compatibility"""
    try:
        plt.switch_backend('TkAgg')  # Try TkAgg first
    except:
        try:
            plt.switch_backend('Qt5Agg')  # Try Qt5Agg as fallback
        except:
            try:
                plt.switch_backend('Agg')  # Fallback to non-interactive
                print("Warning: Using non-interactive backend. Plots will be saved to files instead of displayed.")
            except:
                pass  # Use whatever backend is available


# Main function that allows running specific questions
if __name__ == "__main__":
    # Set up matplotlib backend
    set_backend()

    while True:
        print("\n==================================================")
        print("Fuzzy Logic Assignment - Select a question to run:")
        print("1. Implement different membership functions")
        print("2. Alpha-cut of a fuzzy set")
        print("3. Union and intersection of fuzzy sets")
        print("4. Construct a fuzzy relation matrix")
        print("5. Max-min composition of fuzzy relations")
        print("6. Check properties of a fuzzy relation")
        print("7. Extension principle for fuzzy set mapping")
        print("8. Run all questions")
        print("0. Exit")
        print("==================================================")

        choice = input("Enter your choice (0-8): ")

        if choice == '1':
            question1()
        elif choice == '2':
            question2()
        elif choice == '3':
            question3()
        elif choice == '4':
            question4()
        elif choice == '5':
            question5()
        elif choice == '6':
            question6()
        elif choice == '7':
            question7()
        elif choice == '8':
            question1()
            question2()
            question3()
            question4()
            question5()
            question6()
            question7()
        elif choice == '0':
            print("Exiting program...")
            break
        else:
            print("Invalid choice. Please try again.")